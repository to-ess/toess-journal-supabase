import { httpsCallable } from "firebase/functions";
import { db, functions, auth } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where, 
  orderBy,
  updateDoc,
  deleteDoc,
  Timestamp 
} from "firebase/firestore";

/**
 * Creates a manuscript submission and sends confirmation email via Cloud Function
 */
export async function createSubmission(data) {
  console.log("📤 Creating submission with data:", data);
  
  try {
    // Call the Firebase Cloud Function (this sends the email!)
    const submitManuscript = httpsCallable(functions, 'submitManuscript');
    
    console.log("🔥 Calling Firebase function: submitManuscript");
    
    const result = await submitManuscript(data);
    
    console.log("✅ Function response:", result.data);
    
    // Check if email was sent
    if (result.data.emailSent) {
      console.log("📧 Confirmation email sent to:", data.authorEmail);
      console.log("📬 Message ID:", result.data.messageId);
    } else {
      console.warn("⚠️ Email may not have been sent");
    }
    
    return result.data;
    
  } catch (error) {
    console.error("❌ Submission error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error details:", error.details);
    
    // Re-throw so the UI can handle it
    throw new Error(error.message || "Failed to submit manuscript");
  }
}

/**
 * Get all submissions for a specific author
 */
export async function getAuthorSubmissions(authorId) {
  try {
    const q = query(
      collection(db, "submissions"),
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    }));
  } catch (error) {
    console.error("Error getting author submissions:", error);
    throw error;
  }
}

/**
 * Alias for getAuthorSubmissions (for backward compatibility)
 */
export const getMySubmissions = getAuthorSubmissions;

/**
 * Get all submissions (for admin/editor)
 */
export async function getAllSubmissions() {
  try {
    const q = query(
      collection(db, "submissions"),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    }));
  } catch (error) {
    console.error("Error getting all submissions:", error);
    throw error;
  }
}

/**
 * Get a single submission by ID
 */
export async function getSubmission(submissionId) {
  try {
    const docRef = doc(db, "submissions", submissionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Submission not found");
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
    };
  } catch (error) {
    console.error("Error getting submission:", error);
    throw error;
  }
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(submissionId, status) {
  try {
    const docRef = doc(db, "submissions", submissionId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    throw error;
  }
}

/**
 * Update submission with any data
 */
export async function updateSubmission(submissionId, data) {
  try {
    const docRef = doc(db, "submissions", submissionId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    throw error;
  }
}

/**
 * Publish a paper
 */
export async function publishPaper(submissionId, publicationData) {
  try {
    const docRef = doc(db, "submissions", submissionId);
    await updateDoc(docRef, {
      status: "published",
      isPublished: true,
      publicationDate: Timestamp.now(),
      ...publicationData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error publishing paper:", error);
    throw error;
  }
}

/**
 * Get all published papers (for Archives page)
 * Works for both logged-in and anonymous users
 */
export async function getPublishedPapers() {
  try {
    console.log("📚 Fetching published papers...");
    console.log("Auth status:", auth.currentUser ? `Logged in as ${auth.currentUser.email}` : "Anonymous");
    
    // Get all submissions and filter in JavaScript (no composite index needed)
    const snapshot = await getDocs(collection(db, "submissions"));
    
    console.log("📦 Total documents fetched:", snapshot.docs.length);
    
    const allDocs = snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Log each document for debugging
      console.log(`Document ${doc.id}:`, {
        title: data.title?.substring(0, 50) + "...",
        isPublished: data.isPublished,
        status: data.status,
        hasPublicationDate: !!data.publicationDate
      });
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        publicationDate: data.publicationDate?.toDate?.() || null,
      };
    });
    
    // Filter for published papers only
    const publishedPapers = allDocs.filter(doc => doc.isPublished === true);
    
    console.log("✅ Published papers found:", publishedPapers.length);
    
    if (publishedPapers.length === 0) {
      console.warn("⚠️ No published papers found!");
      console.warn("Make sure:");
      console.warn("1. Papers have isPublished: true (boolean)");
      console.warn("2. Admin clicked 'Publish' button in dashboard");
      console.warn("3. Check Firebase Console → Firestore → submissions collection");
    } else {
      console.log("📋 Published papers:", publishedPapers.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        isPublished: p.isPublished
      })));
    }
    
    // Sort by publication date (newest first)
    publishedPapers.sort((a, b) => {
      const dateA = a.publicationDate || a.createdAt || new Date(0);
      const dateB = b.publicationDate || b.createdAt || new Date(0);
      return dateB - dateA;
    });
    
    return publishedPapers;
  } catch (error) {
    console.error("❌ Error getting published papers:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // If permission denied, return empty array and log helpful message
    if (error.code === 'permission-denied') {
      console.error("🔒 PERMISSION DENIED!");
      console.error("Check Firestore Rules:");
      console.error("1. Go to Firebase Console → Firestore → Rules");
      console.error("2. Make sure you have: allow read: if resource.data.isPublished == true");
      console.error("3. This allows public to read published papers");
      return [];
    }
    
    throw error;
  }
}

/**
 * Get submissions by status
 */
export async function getSubmissionsByStatus(status) {
  try {
    const q = query(
      collection(db, "submissions"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    }));
  } catch (error) {
    console.error("Error getting submissions by status:", error);
    throw error;
  }
}

/**
 * Assign reviewer to submission
 */
export async function assignReviewer(submissionId, reviewerId, reviewerEmail) {
  try {
    const docRef = doc(db, "submissions", submissionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Submission not found");
    }
    
    const currentReviewers = docSnap.data().assignedReviewers || [];
    
    await updateDoc(docRef, {
      assignedReviewers: [...currentReviewers, { reviewerId, reviewerEmail, assignedAt: Timestamp.now() }],
      status: "under-review",
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error assigning reviewer:", error);
    throw error;
  }
}

/**
 * Add review comment
 */
export async function addReviewComment(submissionId, comment, reviewerId) {
  try {
    const docRef = doc(db, "submissions", submissionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Submission not found");
    }
    
    const currentComments = docSnap.data().reviewComments || [];
    
    await updateDoc(docRef, {
      reviewComments: [
        ...currentComments,
        {
          comment,
          reviewerId,
          timestamp: Timestamp.now(),
        }
      ],
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding review comment:", error);
    throw error;
  }
}

/**
 * Delete a submission
 */
export async function deleteSubmission(submissionId) {
  try {
    const docRef = doc(db, "submissions", submissionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting submission:", error);
    throw error;
  }
}

 /**
 * Get pending papers awaiting reviewer assignment
 */
export async function getPendingPapers() {
  return getSubmissionsByStatus("pending");
}