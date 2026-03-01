import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

/**
 * Notify reviewer when a paper is assigned to them
 */
export const sendReviewerAssignedEmail = async ({ reviewerEmail, reviewerName, paperTitle, paperId, deadline }) => {
  try {
    const fn = httpsCallable(functions, "notifyReviewerAssigned");
    const result = await fn({ reviewerEmail, reviewerName, paperTitle, paperId, deadline });
    console.log("✅ Reviewer assignment email sent:", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ Failed to send reviewer assignment email:", error);
    // Don't throw — email failure shouldn't break the assignment flow
  }
};

/**
 * Notify author when editorial decision is made
 * decision: "accept" | "minor-revision" | "major-revision" | "reject"
 */
export const sendEditorialDecisionEmail = async ({ authorEmail, authorName, paperTitle, decision, comments }) => {
  try {
    const fn = httpsCallable(functions, "notifyEditorialDecision");
    const result = await fn({ authorEmail, authorName, paperTitle, decision, comments });
    console.log("✅ Editorial decision email sent:", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ Failed to send editorial decision email:", error);
  }
};

/**
 * Notify author when paper is published
 */
export const sendPaperPublishedEmail = async ({ authorEmail, authorName, paperTitle, doi, volume, issue }) => {
  try {
    const fn = httpsCallable(functions, "notifyPaperPublished");
    const result = await fn({ authorEmail, authorName, paperTitle, doi, volume, issue });
    console.log("✅ Paper published email sent:", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ Failed to send paper published email:", error);
  }
};