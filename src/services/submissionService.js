import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp
} from "firebase/firestore";

import { httpsCallable } from "firebase/functions";

import { db, functions } from "./firebase";


/* ===============================
   CREATE SUBMISSION (USES CLOUD FUNCTION)
================================ */

export const createSubmission = async (submissionData) => {

  try {

    const submitManuscript = httpsCallable(
      functions,
      "submitManuscript"
    );

    const result = await submitManuscript({
      articleType: submissionData.articleType,
      title: submissionData.title,
      abstract: submissionData.abstract,
      authors: submissionData.authors,
      keywords: submissionData.keywords || [],
      category: submissionData.category,
      suggestedReviewers: submissionData.suggestedReviewers || [],
      fileUrl: submissionData.fileUrl,
      authorEmail: submissionData.authorEmail
    });

    return result.data;

  } catch (error) {

    console.error("Create submission error:", error);

    throw error;
  }

};


/* ===============================
   AUTHOR QUERIES
================================ */

export const getMySubmissions = async (authorId) => {

  const q = query(
    collection(db, "submissions"),
    where("authorId", "==", authorId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};


/* ===============================
   GET SINGLE SUBMISSION
================================ */

export const getSubmissionById = async (id) => {

  const docRef = doc(db, "submissions", id);

  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    throw new Error("Submission not found");
  }

  return {
    id: snap.id,
    ...snap.data()
  };
};


/* ===============================
   ADMIN QUERIES
================================ */

export const getAllSubmissions = async () => {

  const q = query(
    collection(db, "submissions"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};


/* ===============================
   UPDATE SUBMISSION
================================ */

export const updateSubmission = async (id, data) => {

  await updateDoc(
    doc(db, "submissions", id),
    {
      ...data,
      updatedAt: Timestamp.now()
    }
  );

};


/* ===============================
   DELETE SUBMISSION
================================ */

export const deleteSubmission = async (id) => {

  await deleteDoc(
    doc(db, "submissions", id)
  );

};
