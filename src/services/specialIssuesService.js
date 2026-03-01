import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  Timestamp,
  increment,
} from "firebase/firestore";

/* ================= COLLECTION REF ================= */
const specialIssuesRef = collection(db, "specialIssues");


/* ==================================================
   CREATE SPECIAL ISSUE (Admin)
================================================== */
export async function createSpecialIssue(data) {
  try {
    const docRef = await addDoc(specialIssuesRef, {
      ...data,
      status: "active",
      submissionCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...data,
      status: "active",
      submissionCount: 0,
    };

  } catch (error) {
    console.error("Error creating special issue:", error);
    throw error;
  }
}


/* ==================================================
   GET ACTIVE SPECIAL ISSUES (Author dropdown)
   SAFE VERSION — no Firestore index required
================================================== */
export async function getActiveSpecialIssues() {
  try {

    const snapshot = await getDocs(specialIssuesRef);

    const activeIssues = snapshot.docs
      .map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        deadline: docSnap.data().deadline?.toDate?.() || null,
        createdAt: docSnap.data().createdAt?.toDate?.() || null,
        updatedAt: docSnap.data().updatedAt?.toDate?.() || null,
      }))
      .filter(issue => issue.status === "active")
      .sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline - b.deadline;
      });

    console.log("Active special issues:", activeIssues);

    return activeIssues;

  } catch (error) {
    console.error("Error getting active special issues:", error);
    return [];
  }
}


/* ==================================================
   GET ALL SPECIAL ISSUES (Admin)
================================================== */
export async function getAllSpecialIssues() {
  try {

    const q = query(
      specialIssuesRef,
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
      deadline: docSnap.data().deadline?.toDate?.() || null,
      createdAt: docSnap.data().createdAt?.toDate?.() || null,
      updatedAt: docSnap.data().updatedAt?.toDate?.() || null,
    }));

  } catch (error) {
    console.error("Error getting all special issues:", error);
    throw error;
  }
}


/* ==================================================
   GET SINGLE SPECIAL ISSUE
================================================== */
export async function getSpecialIssue(id) {
  try {

    const docRef = doc(db, "specialIssues", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Special issue not found");
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      deadline: docSnap.data().deadline?.toDate?.() || null,
      createdAt: docSnap.data().createdAt?.toDate?.() || null,
      updatedAt: docSnap.data().updatedAt?.toDate?.() || null,
    };

  } catch (error) {
    console.error("Error getting special issue:", error);
    throw error;
  }
}


/* ==================================================
   UPDATE SPECIAL ISSUE
================================================== */
export async function updateSpecialIssue(id, data) {
  try {

    const docRef = doc(db, "specialIssues", id);

    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    return true;

  } catch (error) {
    console.error("Error updating special issue:", error);
    throw error;
  }
}


/* ==================================================
   DELETE SPECIAL ISSUE
================================================== */
export async function deleteSpecialIssue(id) {
  try {

    const docRef = doc(db, "specialIssues", id);

    await deleteDoc(docRef);

    return true;

  } catch (error) {
    console.error("Error deleting special issue:", error);
    throw error;
  }
}


/* ==================================================
   INCREMENT SUBMISSION COUNT
================================================== */
export async function incrementSpecialIssueCount(id) {
  try {

    const docRef = doc(db, "specialIssues", id);

    await updateDoc(docRef, {
      submissionCount: increment(1),
      updatedAt: Timestamp.now(),
    });

  } catch (error) {
    console.error("Error incrementing submission count:", error);
  }
}
