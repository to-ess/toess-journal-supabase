import { supabase } from "./supabase";

/**
 * Queue email notification in database
 */
const queueEmailNotification = async (notification) => {
  try {
    // Validate required fields
    if (!notification.recipientEmail) {
      console.warn("⚠️ Missing recipient email, skipping notification");
      return { success: false, error: "Missing recipient email" };
    }

    const { error } = await supabase.from("email_notifications").insert({
      type: notification.type || "general",
      recipient_email: notification.recipientEmail.trim(),
      recipient_name: notification.recipientName || "User",
      paper_id: notification.paperId || null,
      paper_title: notification.paperTitle || "Untitled",
      subject: notification.subject || "Notification from Editorial System",
      message: notification.message || "",
      author_email: notification.authorEmail || null,
      author_name: notification.authorName || null,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Error queuing email:", error);
      return { success: false, error };
    }

    console.log("✅ Email notification queued:", {
      type: notification.type,
      recipient: notification.recipientEmail,
      subject: notification.subject,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Error in queueEmailNotification:", error);
    return { success: false, error };
  }
};

/**
 * Send confirmation email when manuscript is submitted
 */
export const sendSubmissionConfirmationEmail = async (data) => {
  try {
    if (!data.authorEmail) {
      console.warn("⚠️ No author email provided for submission confirmation");
      return { success: false };
    }

    const result = await queueEmailNotification({
      type: "submission",
      recipientEmail: data.authorEmail,
      recipientName: data.authorName || "Author",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `Manuscript Received: ${data.paperTitle || "Your Submission"}`,
      message: `Dear ${data.authorName || "Author"},\n\nThank you for submitting your manuscript titled "${data.paperTitle || "Your Manuscript"}" to our journal. We have received your submission and it is now under review.\n\nYou will receive further updates as the review process progresses.\n\nBest regards,\nEditorial Team`,
      authorEmail: data.authorEmail,
      authorName: data.authorName || "Author",
    });

    return result;
  } catch (error) {
    console.warn("⚠️ Submission confirmation email failed (non-blocking):", error.message);
    return { success: false, message: "Email failed but submission recorded" };
  }
};

/**
 * Send email to reviewer when assigned a paper
 */
export const sendReviewerAssignedEmail = async (data) => {
  try {
    if (!data.reviewerEmail) {
      console.warn("⚠️ No reviewer email provided");
      return { success: false };
    }

    const result = await queueEmailNotification({
      type: "review_assigned",
      recipientEmail: data.reviewerEmail,
      recipientName: data.reviewerName || "Reviewer",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `You Have Been Assigned as a Reviewer: ${data.paperTitle || "Paper Review"}`,
      message: `Dear ${data.reviewerName || "Reviewer"},\n\nYou have been selected as a reviewer for the following manuscript:\n\nTitle: ${data.paperTitle || "Untitled"}\n\nDeadline: ${data.deadline || "TBD"}\n\nPlease log in to the review portal to access the manuscript and submit your review.\n\nThank you for your contribution to our journal!\n\nBest regards,\nEditorial Team`,
      authorEmail: data.reviewerEmail,
      authorName: data.reviewerName || "Reviewer",
    });

    return result;
  } catch (error) {
    console.warn("⚠️ Reviewer assignment email failed (non-blocking):", error.message);
    return { success: false, message: "Email failed but assignment recorded" };
  }
};

/**
 * Send editorial decision email to author
 */
export const sendEditorialDecisionEmail = async (data) => {
  try {
    if (!data.authorEmail) {
      console.warn("⚠️ No author email provided for editorial decision");
      return { success: false };
    }

    const decisionText = {
      accept: "ACCEPTED",
      reject: "REJECTED",
      "minor-revision": "REQUIRES MINOR REVISION",
      "major-revision": "REQUIRES MAJOR REVISION"
    }[data.decision] || "DECISION PENDING";

    const result = await queueEmailNotification({
      type: "decision",
      recipientEmail: data.authorEmail,
      recipientName: data.authorName || "Author",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `Editorial Decision: ${data.paperTitle || "Your Manuscript"}`,
      message: `Dear ${data.authorName || "Author"},\n\nWe have completed the review process for your manuscript titled "${data.paperTitle || "Your Manuscript"}".\n\nEDITORIAL DECISION: ${decisionText}\n\nEditor's Comments:\n${data.comments || "No additional comments"}\n\nPlease submit your revised manuscript according to the reviewer comments.\n\nBest regards,\nEditorial Team`,
      authorEmail: data.authorEmail,
      authorName: data.authorName || "Author",
    });

    return result;
  } catch (error) {
    console.warn("⚠️ Editorial decision email failed (non-blocking):", error.message);
    return { success: false, message: "Email failed but decision recorded" };
  }
};

/**
 * Send paper published email to author
 */
export const sendPaperPublishedEmail = async (data) => {
  try {
    if (!data.authorEmail) {
      console.warn("⚠️ No author email provided for published notification");
      return { success: false };
    }

    const result = await queueEmailNotification({
      type: "published",
      recipientEmail: data.authorEmail,
      recipientName: data.authorName || "Author",
      paperId: data.paperId,
      paperTitle: data.paperTitle || "Manuscript",
      subject: `Your Paper Has Been Published: ${data.paperTitle || "Your Manuscript"}`,
      message: `Dear ${data.authorName || "Author"},\n\nCongratulations! Your manuscript titled "${data.paperTitle || "Your Manuscript"}" has been published and is now available in our archives.\n\nDOI: ${data.doi || "N/A"}\n\nYour research is now accessible to the scientific community. Thank you for contributing to our journal!\n\nBest regards,\nEditorial Team`,
      authorEmail: data.authorEmail,
      authorName: data.authorName || "Author",
    });

    return result;
  } catch (error) {
    console.warn("⚠️ Paper published email failed (non-blocking):", error.message);
    return { success: true, message: "Paper published (email queued)" };
  }
};

/**
 * Get all pending email notifications (for admin dashboard)
 */
export const getPendingEmailNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching pending emails:", error);
    return [];
  }
};

/**
 * Get all email notifications
 */
export const getAllEmailNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from("email_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching email notifications:", error);
    return [];
  }
};

/**
 * Get email notifications by status
 */
export const getEmailNotificationsByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching email notifications by status:", error);
    return [];
  }
};

/**
 * Mark email as sent
 */
export const markEmailAsSent = async (notificationId) => {
  try {
    const { error } = await supabase
      .from("email_notifications")
      .update({ 
        status: "sent",
        sent_at: new Date().toISOString()
      })
      .eq("id", notificationId);

    if (error) throw error;
    console.log("✅ Email marked as sent:", notificationId);
    return { success: true };
  } catch (error) {
    console.error("Error marking email as sent:", error);
    return { success: false, error };
  }
};

/**
 * Mark email as failed
 */
export const markEmailAsFailed = async (notificationId, errorMessage) => {
  try {
    const { error } = await supabase
      .from("email_notifications")
      .update({ 
        status: "failed",
        error_message: errorMessage || "Unknown error"
      })
      .eq("id", notificationId);

    if (error) throw error;
    console.log("✅ Email marked as failed:", notificationId);
    return { success: true };
  } catch (error) {
    console.error("Error marking email as failed:", error);
    return { success: false, error };
  }
};

/**
 * Get email notifications statistics
 */
export const getEmailStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from("email_notifications")
      .select("status, type");

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(d => d.status === "pending").length,
      sent: data.filter(d => d.status === "sent").length,
      failed: data.filter(d => d.status === "failed").length,
      byType: {
        submission: data.filter(d => d.type === "submission").length,
        decision: data.filter(d => d.type === "decision").length,
        published: data.filter(d => d.type === "published").length,
        review_assigned: data.filter(d => d.type === "review_assigned").length,
      }
    };

    console.log("📊 Email Statistics:", stats);
    return stats;
  } catch (error) {
    console.error("Error getting email statistics:", error);
    return null;
  }
};

/**
 * Delete old email notifications (older than 30 days)
 */
export const deleteOldEmailNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { error, data } = await supabase
      .from("email_notifications")
      .delete()
      .lt("created_at", thirtyDaysAgo);

    if (error) throw error;
    console.log("✅ Old email notifications deleted");
    return { success: true };
  } catch (error) {
    console.error("Error deleting old email notifications:", error);
    return { success: false, error };
  }
};