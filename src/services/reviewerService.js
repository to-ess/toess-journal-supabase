import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  sendReviewerAssignedEmail,
  sendEditorialDecisionEmail,
} from "./emailService";

/* ================= REVIEWER REGISTRATION ================= */
export const registerAsReviewer = async (userId, formData) => {
  try {
    const reviewerRef = doc(db, "reviewerRequests", userId);
    await setDoc(reviewerRef, {
      userId,
      fullName: formData.fullName,
      email: formData.email,
      institution: formData.institution,
      designation: formData.designation,
      expertise: formData.expertise,
      qualifications: formData.qualifications,
      experience: formData.experience,
      linkedIn: formData.linkedIn || "",
      orcid: formData.orcid || "",
      status: "pending",
      submittedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error registering reviewer:", error);
    throw error;
  }
};

/* ================= GET REVIEWER REQUEST STATUS ================= */
export const getReviewerRequestStatus = async (userId) => {
  try {
    const ref = doc(db, "reviewerRequests", userId);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (error) {
    console.error("Error getting reviewer request:", error);
    throw error;
  }
};

/* ================= GET ALL REVIEWER REQUESTS (Admin) ================= */
export const getAllReviewerRequests = async () => {
  try {
    const snapshot = await getDocs(collection(db, "reviewerRequests"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting reviewer requests:", error);
    throw error;
  }
};

/* ================= APPROVE REVIEWER (Admin) ================= */
export const approveReviewer = async (userId) => {
  try {
    await updateDoc(doc(db, "reviewerRequests", userId), {
      status: "approved",
      approvedAt: Timestamp.now()
    });

    await setDoc(doc(db, "users", userId), {
      role: "reviewer",
      updatedAt: Timestamp.now()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error approving reviewer:", error);
    throw error;
  }
};

/* ================= REJECT REVIEWER (Admin) ================= */
export const rejectReviewer = async (userId, reason = "") => {
  try {
    await updateDoc(doc(db, "reviewerRequests", userId), {
      status: "rejected",
      rejectionReason: reason,
      rejectedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error rejecting reviewer:", error);
    throw error;
  }
};

/* ================= GET APPROVED REVIEWERS ================= */
export const getRegisteredReviewers = async () => {
  try {
    const q = query(
      collection(db, "reviewerRequests"),
      where("status", "==", "approved")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting approved reviewers:", error);
    throw error;
  }
};

/* ================= ASSIGN PAPER TO REVIEWER (Admin) ================= */
export const assignPaperToReviewer = async (paperId, reviewerEmail, reviewerName, deadline) => {
  try {
    const assignmentRef = doc(collection(db, "reviewAssignments"));
    await setDoc(assignmentRef, {
      paperId,
      reviewerEmail,
      reviewerName,
      assignedAt: Timestamp.now(),
      deadline: Timestamp.fromDate(new Date(deadline)),
      status: "pending",
      reviewSubmitted: false,
      createdAt: Timestamp.now()
    });

    // Update the paper status to under-review
    const paperRef = doc(db, "submissions", paperId);
    const paperDoc = await getDoc(paperRef);
    if (paperDoc.exists()) {
      const currentReviewers = paperDoc.data().assignedReviewers || [];
      await updateDoc(paperRef, {
        assignedReviewers: [...currentReviewers, {
          email: reviewerEmail,
          name: reviewerName,
          assignedAt: Timestamp.now(),
          assignmentId: assignmentRef.id
        }],
        reviewStatus: "under-review",
        status: "under-review"
      });

      // ✅ Send email to reviewer
      await sendReviewerAssignedEmail({
        reviewerEmail,
        reviewerName,
        paperTitle: paperDoc.data().title,
        paperId,
        deadline, // ISO string — emailService handles formatting
      });
    }

    return { success: true, assignmentId: assignmentRef.id };
  } catch (error) {
    console.error("Error assigning paper:", error);
    throw error;
  }
};

/* ================= GET ALL ASSIGNMENTS (Admin) ================= */
export const getAllAssignments = async () => {
  try {
    const snapshot = await getDocs(collection(db, "reviewAssignments"));
    const assignments = [];
    for (const assignmentDoc of snapshot.docs) {
      const data = assignmentDoc.data();
      try {
        const paperRef = doc(db, "submissions", data.paperId);
        const paperDoc = await getDoc(paperRef);
        assignments.push({
          id: assignmentDoc.id,
          ...data,
          paper: paperDoc.exists() ? { id: paperDoc.id, ...paperDoc.data() } : null
        });
      } catch {
        assignments.push({ id: assignmentDoc.id, ...data, paper: null });
      }
    }
    return assignments;
  } catch (error) {
    console.error("Error getting all assignments:", error);
    throw error;
  }
};

/* ================= GET ASSIGNMENTS FOR REVIEWER ================= */
export const getReviewerAssignments = async (reviewerEmail) => {
  try {
    const q = query(
      collection(db, "reviewAssignments"),
      where("reviewerEmail", "==", reviewerEmail)
    );
    const snapshot = await getDocs(q);
    const assignments = [];
    for (const assignmentDoc of snapshot.docs) {
      const data = assignmentDoc.data();
      try {
        const paperRef = doc(db, "submissions", data.paperId);
        const paperDoc = await getDoc(paperRef);
        assignments.push({
          id: assignmentDoc.id,
          ...data,
          paper: paperDoc.exists() ? { id: paperDoc.id, ...paperDoc.data() } : null
        });
      } catch {
        assignments.push({ id: assignmentDoc.id, ...data, paper: null });
      }
    }
    return assignments;
  } catch (error) {
    console.error("Error getting reviewer assignments:", error);
    throw error;
  }
};

/* ================= SUBMIT REVIEW (Reviewer) ================= */
export const submitReview = async (assignmentId, reviewData) => {
  try {
    const reviewRef = doc(collection(db, "reviews"));
    await setDoc(reviewRef, {
      assignmentId,
      paperId: reviewData.paperId,
      reviewerEmail: reviewData.reviewerEmail,
      reviewerName: reviewData.reviewerName,
      originalityRating: reviewData.originalityRating,
      methodologyRating: reviewData.methodologyRating,
      clarityRating: reviewData.clarityRating,
      significanceRating: reviewData.significanceRating,
      overallRating: reviewData.overallRating,
      strengths: reviewData.strengths,
      weaknesses: reviewData.weaknesses,
      detailedComments: reviewData.detailedComments,
      confidentialComments: reviewData.confidentialComments || "",
      recommendation: reviewData.recommendation,
      submittedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    });

    // Mark assignment as completed
    await updateDoc(doc(db, "reviewAssignments", assignmentId), {
      status: "completed",
      reviewSubmitted: true,
      reviewId: reviewRef.id,
      completedAt: Timestamp.now()
    });

    // Update paper review count
    const paperRef = doc(db, "submissions", reviewData.paperId);
    const paperDoc = await getDoc(paperRef);
    if (paperDoc.exists()) {
      const currentReviews = paperDoc.data().reviews || [];
      await updateDoc(paperRef, {
        reviews: [...currentReviews, reviewRef.id],
        reviewCount: (paperDoc.data().reviewCount || 0) + 1,
        lastReviewedAt: Timestamp.now()
      });
    }

    return { success: true, reviewId: reviewRef.id };
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

/* ================= GET REVIEWS FOR PAPER (Admin) ================= */
export const getReviewsForPaper = async (paperId) => {
  try {
    const q = query(collection(db, "reviews"), where("paperId", "==", paperId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting reviews for paper:", error);
    throw error;
  }
};

/* ================= GET ALL REVIEWED PAPERS (Admin decision page) ================= */
export const getPapersWithReviews = async () => {
  try {
    const reviewsSnap = await getDocs(collection(db, "reviews"));
    const paperIds = [...new Set(reviewsSnap.docs.map(d => d.data().paperId))];

    const papers = [];
    for (const paperId of paperIds) {
      const paperDoc = await getDoc(doc(db, "submissions", paperId));
      if (paperDoc.exists()) {
        const paperReviews = reviewsSnap.docs
          .filter(d => d.data().paperId === paperId)
          .map(d => ({ id: d.id, ...d.data() }));
        papers.push({
          id: paperDoc.id,
          ...paperDoc.data(),
          reviews: paperReviews
        });
      }
    }
    return papers;
  } catch (error) {
    console.error("Error getting papers with reviews:", error);
    throw error;
  }
};

/* ================= ADMIN FINAL DECISION ================= */
export const makeEditorialDecision = async (paperId, decision, comments = "") => {
  try {
    const newStatus =
      decision === "accept" ? "accepted" :
      decision === "reject" ? "rejected" : "revision-required";

    await updateDoc(doc(db, "submissions", paperId), {
      editorialDecision: decision,
      editorialComments: comments,
      decisionMadeAt: Timestamp.now(),
      status: newStatus,
      updatedAt: Timestamp.now()
    });

    // ✅ Send email to author
    const paperDoc = await getDoc(doc(db, "submissions", paperId));
    if (paperDoc.exists()) {
      const paper = paperDoc.data();
      await sendEditorialDecisionEmail({
        authorEmail: paper.authorEmail,
        authorName: paper.authorName,
        paperTitle: paper.title,
        decision,
        comments,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error making editorial decision:", error);
    throw error;
  }
};