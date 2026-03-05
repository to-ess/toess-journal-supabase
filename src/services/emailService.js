// emailService.js
// Queues emails to email_notifications table
// Supabase DB webhook triggers send-email Edge Function → Resend delivers

import { supabase } from "./supabase";

// ── Internal Queue Helper ──────────────────────────────────────────────────

const queueEmailNotification = async (notification) => {
  try {
    if (!notification.recipientEmail) {
      console.warn("⚠️ Missing recipient email, skipping notification");
      return { success: false, error: "Missing recipient email" };
    }

    console.log(
      "📧 Queuing email:",
      notification.type,
      notification.recipientEmail,
    );

    const { data, error } = await supabase
      .from("email_notifications")
      .insert({
        type: notification.type || "general",
        recipient_email: notification.recipientEmail.trim(),
        recipient_name: notification.recipientName || "User",
        paper_id: notification.paperId || null,
        paper_title: notification.paperTitle || null,
        subject: notification.subject || "Notification from Editorial System",
        message: notification.message || "",
        author_email: notification.authorEmail || null,
        author_name: notification.authorName || null,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("❌ Error queuing email:", error);
      return { success: false, error };
    }

    console.log("✅ Email queued:", {
      id: data.id,
      type: notification.type,
      recipient: notification.recipientEmail,
    });
    return { success: true, notificationId: data.id };
  } catch (error) {
    console.error("❌ Error in queueEmailNotification:", error);
    return { success: false, error };
  }
};

// ── Public Email Actions ───────────────────────────────────────────────────

/**
 * 1. Welcome email on registration
 */
export const sendWelcomeEmail = async (data) => {
  try {
    if (!data.email) return { success: false };
    return await queueEmailNotification({
      type: "welcome",
      recipientEmail: data.email,
      recipientName: data.name || "Author",
      subject: "Welcome to TOESS — Your Account is Ready",
      message: "",
      authorEmail: data.email,
      authorName: data.name || "Author",
    });
  } catch (error) {
    console.warn("⚠️ Welcome email failed:", error.message);
    return { success: false };
  }
};

/**
 * 2. Submission confirmation to author
 */
export const sendSubmissionConfirmationEmail = async (data) => {
  try {
    if (!data.authorEmail) return { success: false };
    return await queueEmailNotification({
      type: "submission",
      recipientEmail: data.authorEmail,
      recipientName: data.authorName || "Author",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `Manuscript Received: ${data.paperTitle || "Your Submission"}`,
      message: "",
      authorEmail: data.authorEmail,
      authorName: data.authorName || "Author",
    });
  } catch (error) {
    console.warn("⚠️ Submission confirmation email failed:", error.message);
    return { success: false };
  }
};

/**
 * 3. 
 *  assigned notification
 */
export const sendReviewerAssignedEmail = async (data) => {
  try {
    if (!data.reviewerEmail) return { success: false };
    return await queueEmailNotification({
      type: "review_assigned",
      recipientEmail: data.reviewerEmail,
      recipientName: data.reviewerName || "Reviewer",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `Review Assignment: ${data.paperTitle || "Paper Review"}`,
      message: data.deadline || "",
      authorEmail: data.reviewerEmail,
      authorName: data.reviewerName || "Reviewer",
    });
  } catch (error) {
    console.warn("⚠️ Reviewer assignment email failed:", error.message);
    return { success: false };
  }
};

/**
 * 4. Review submitted confirmation to reviewer
 */
export const sendReviewSubmittedEmail = async (data) => {
  try {
    if (!data.reviewerEmail) return { success: false };
    return await queueEmailNotification({
      type: "review_submitted",
      recipientEmail: data.reviewerEmail,
      recipientName: data.reviewerName || "Reviewer",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `Review Submitted: ${data.paperTitle || "Manuscript"}`,
      message: "",
      authorEmail: data.reviewerEmail,
      authorName: data.reviewerName || "Reviewer",
    });
  } catch (error) {
    console.warn("⚠️ Review submitted email failed:", error.message);
    return { success: false };
  }
};

/**
 * 5. Reviewer application approved
 */
export const sendReviewerApprovedEmail = async (data) => {
  try {
    if (!data.email) return { success: false };
    return await queueEmailNotification({
      type: "reviewer_approved",
      recipientEmail: data.email,
      recipientName: data.name || "Reviewer",
      subject: "Your Reviewer Application Has Been Approved",
      message: "",
      authorEmail: data.email,
      authorName: data.name || "Reviewer",
    });
  } catch (error) {
    console.warn("⚠️ Reviewer approved email failed:", error.message);
    return { success: false };
  }
};

/**
 * 6. Reviewer application rejected
 */
export const sendReviewerRejectedEmail = async (data) => {
  try {
    if (!data.email) return { success: false };
    return await queueEmailNotification({
      type: "reviewer_rejected",
      recipientEmail: data.email,
      recipientName: data.name || "Applicant",
      subject: "Update on Your Reviewer Application",
      message: data.reason || "",
      authorEmail: data.email,
      authorName: data.name || "Applicant",
    });
  } catch (error) {
    console.warn("⚠️ Reviewer rejected email failed:", error.message);
    return { success: false };
  }
};

/**
 * 7. Editorial decision (accept / reject / minor / major revision)
 */
export const sendEditorialDecisionEmail = async (data) => {
  try {
    if (!data.authorEmail) return { success: false };
    return await queueEmailNotification({
      type: "decision",
      recipientEmail: data.authorEmail,
      recipientName: data.authorName || "Author",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `Editorial Decision: ${data.paperTitle || "Your Manuscript"}`,
      // First line = decision key, rest = editor comments
      message: `${data.decision}\n${data.comments || ""}`,
      authorEmail: data.authorEmail,
      authorName: data.authorName || "Author",
    });
  } catch (error) {
    console.warn("⚠️ Editorial decision email failed:", error.message);
    return { success: false };
  }
};

/**
 * 8. Paper published notification
 */
export const sendPaperPublishedEmail = async (data) => {
  try {
    if (!data.authorEmail) return { success: false };
    return await queueEmailNotification({
      type: "published",
      recipientEmail: data.authorEmail,
      recipientName: data.authorName || "Author",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `Your Paper Has Been Published: ${data.paperTitle || "Your Manuscript"}`,
      message: data.doi || "",
      authorEmail: data.authorEmail,
      authorName: data.authorName || "Author",
    });
  } catch (error) {
    console.warn("⚠️ Paper published email failed:", error.message);
    return { success: false };
  }
};

// ── Admin Query Helpers ────────────────────────────────────────────────────

export const getPendingEmailNotifications = async () => {
  const { data, error } = await supabase
    .from("email_notifications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching pending emails:", error);
    return [];
  }
  return data || [];
};

export const getAllEmailNotifications = async () => {
  const { data, error } = await supabase
    .from("email_notifications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching all emails:", error);
    return [];
  }
  return data || [];
};

export const getEmailStatistics = async () => {
  const { data, error } = await supabase
    .from("email_notifications")
    .select("status, type");
  if (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
  return {
    total: data.length,
    pending: data.filter((d) => d.status === "pending").length,
    sent: data.filter((d) => d.status === "sent").length,
    failed: data.filter((d) => d.status === "failed").length,
  };
};

export const markEmailAsSent = async (notificationId) => {
  const { error } = await supabase
    .from("email_notifications")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", notificationId);
  if (error) return { success: false, error };
  return { success: true };
};

export const markEmailAsFailed = async (notificationId, errorMessage) => {
  const { error } = await supabase
    .from("email_notifications")
    .update({
      status: "failed",
      error_message: errorMessage || "Unknown error",
    })
    .eq("id", notificationId);
  if (error) return { success: false, error };
  return { success: true };
};
