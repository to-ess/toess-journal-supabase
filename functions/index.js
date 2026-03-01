const functions = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { defineSecret } = require("firebase-functions/params");

admin.initializeApp();
const db = admin.firestore();

const emailUser = defineSecret("EMAIL_USER");
const emailPassword = defineSecret("EMAIL_PASSWORD");

// ✅ Helper: create transporter (reused across all functions)
const createTransporter = (user, pass) => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. EXISTING: Submission Confirmation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
exports.submitManuscript = functions.onCall(
  {
    secrets: [emailUser, emailPassword],
    timeoutSeconds: 540,
    memory: "256MiB",
  },
  async (request) => {
    console.log("========================================");
    console.log("MANUSCRIPT SUBMISSION STARTED");
    console.log("========================================");

    try {
      const data = request.data;
      const auth = request.auth;

      if (!auth) throw new functions.HttpsError("unauthenticated", "User not authenticated");

      const { articleType, title, abstract, authors, keywords, category, fileUrl, authorEmail } = data;

      if (!title || !authorEmail) throw new functions.HttpsError("invalid-argument", "Title and email required");

      const manuscriptId = `TOESS-${new Date().getFullYear()}-${Date.now()}`;

      const docRef = await db.collection("submissions").add({
        manuscriptId,
        articleType,
        title,
        abstract,
        authors,
        keywords,
        category,
        fileUrl,
        authorEmail,
        authorId: auth.uid,
        status: "submitted",
        isPublished: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const emailUserValue = emailUser.value();
      const emailPasswordValue = emailPassword.value();

      const transporter = createTransporter(emailUserValue, emailPasswordValue);
      await transporter.verify();

      const info = await transporter.sendMail({
        from: `"TOESS Journal" <${emailUserValue}>`,
        to: authorEmail,
        subject: "Manuscript Submission Confirmation — TOESS Journal",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #4f46e5; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">Submission Received</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
              <p>Dear Author,</p>
              <p>Your manuscript has been successfully received by the TOESS Journal editorial system.</p>
              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0;"><strong>Manuscript ID:</strong> ${manuscriptId}</p>
                <p style="margin: 4px 0;"><strong>Title:</strong> ${title}</p>
                <p style="margin: 4px 0;"><strong>Status:</strong> Submitted — awaiting reviewer assignment</p>
              </div>
              <p>You will be notified at each stage of the review process.</p>
              <p>Regards,<br/><strong>TOESS Editorial Team</strong></p>
            </div>
          </div>
        `,
      });

      return { success: true, id: docRef.id, manuscriptId, emailSent: true, messageId: info.messageId };

    } catch (error) {
      console.error("Submission error:", error);
      if (error instanceof functions.HttpsError) throw error;
      throw new functions.HttpsError("internal", `Error: ${error.message}`);
    }
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. NEW: Reviewer Assignment Notification
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
exports.notifyReviewerAssigned = functions.onCall(
  {
    secrets: [emailUser, emailPassword],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    console.log("REVIEWER ASSIGNMENT EMAIL STARTED");

    try {
      const auth = request.auth;
      if (!auth) throw new functions.HttpsError("unauthenticated", "User not authenticated");

      const { reviewerEmail, reviewerName, paperTitle, paperId, deadline } = request.data;

      if (!reviewerEmail || !paperTitle) {
        throw new functions.HttpsError("invalid-argument", "reviewerEmail and paperTitle are required");
      }

      const emailUserValue = emailUser.value();
      const emailPasswordValue = emailPassword.value();
      const transporter = createTransporter(emailUserValue, emailPasswordValue);
      await transporter.verify();

      const deadlineStr = deadline
        ? new Date(deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "To be confirmed";

      const info = await transporter.sendMail({
        from: `"TOESS Journal" <${emailUserValue}>`,
        to: reviewerEmail,
        subject: "New Paper Assigned for Review — TOESS Journal",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #059669; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">New Paper Assigned</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
              <p>Dear ${reviewerName || "Reviewer"},</p>
              <p>A new manuscript has been assigned to you for peer review on the TOESS Journal platform.</p>
              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0;"><strong>Paper Title:</strong> ${paperTitle}</p>
                <p style="margin: 4px 0;"><strong>Review Deadline:</strong> ${deadlineStr}</p>
                <p style="margin: 4px 0;"><strong>Paper ID:</strong> ${paperId}</p>
              </div>
              <p>Please log in to your reviewer dashboard to view the full manuscript and submit your review before the deadline.</p>
              <div style="margin: 24px 0;">
                <a href="https://toess-5b213.web.app/dashboard/reviewer"
                  style="background: #059669; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Go to Reviewer Dashboard →
                </a>
              </div>
              <p>Regards,<br/><strong>TOESS Editorial Team</strong></p>
            </div>
          </div>
        `,
      });

      console.log("✅ Reviewer assignment email sent to:", reviewerEmail);
      return { success: true, emailSent: true, messageId: info.messageId };

    } catch (error) {
      console.error("Reviewer assignment email error:", error);
      if (error instanceof functions.HttpsError) throw error;
      throw new functions.HttpsError("internal", `Error: ${error.message}`);
    }
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. NEW: Editorial Decision Notification
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
exports.notifyEditorialDecision = functions.onCall(
  {
    secrets: [emailUser, emailPassword],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    console.log("EDITORIAL DECISION EMAIL STARTED");

    try {
      const auth = request.auth;
      if (!auth) throw new functions.HttpsError("unauthenticated", "User not authenticated");

      const { authorEmail, authorName, paperTitle, decision, comments } = request.data;

      if (!authorEmail || !paperTitle || !decision) {
        throw new functions.HttpsError("invalid-argument", "authorEmail, paperTitle, and decision are required");
      }

      const emailUserValue = emailUser.value();
      const emailPasswordValue = emailPassword.value();
      const transporter = createTransporter(emailUserValue, emailPasswordValue);
      await transporter.verify();

      // Decision-specific styling
      const DECISION_CONFIG = {
        accept:            { label: "Accepted",          color: "#059669", bg: "#ecfdf5", icon: "✅" },
        "minor-revision":  { label: "Minor Revision Required", color: "#2563eb", bg: "#eff6ff", icon: "🔄" },
        "major-revision":  { label: "Major Revision Required", color: "#d97706", bg: "#fffbeb", icon: "🔄" },
        reject:            { label: "Not Accepted",      color: "#dc2626", bg: "#fef2f2", icon: "❌" },
      };

      const cfg = DECISION_CONFIG[decision] || DECISION_CONFIG.reject;

      const info = await transporter.sendMail({
        from: `"TOESS Journal" <${emailUserValue}>`,
        to: authorEmail,
        subject: `Editorial Decision on Your Manuscript — ${cfg.label} | TOESS Journal`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: ${cfg.color}; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">${cfg.icon} Editorial Decision</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
              <p>Dear ${authorName || "Author"},</p>
              <p>The editorial board has reached a decision regarding your manuscript submitted to TOESS Journal.</p>

              <div style="background: ${cfg.bg}; border: 1px solid ${cfg.color}; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0;"><strong>Paper Title:</strong> ${paperTitle}</p>
                <p style="margin: 8px 0 4px 0;"><strong>Decision:</strong>
                  <span style="color: ${cfg.color}; font-weight: bold;">${cfg.label}</span>
                </p>
              </div>

              ${comments ? `
              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Editorial Comments:</strong></p>
                <p style="margin: 0; color: #374151; line-height: 1.6;">${comments}</p>
              </div>
              ` : ""}

              ${decision === "accept" ? `
              <p style="color: #059669; font-weight: bold;">🎉 Congratulations! Your paper will be published shortly.</p>
              ` : decision.includes("revision") ? `
              <p>Please address the editorial comments and resubmit your revised manuscript through the author dashboard.</p>
              ` : `
              <p>We appreciate your submission and encourage you to consider our journal for future research.</p>
              `}

              <div style="margin: 24px 0;">
                <a href="https://toess-5b213.web.app/dashboard/author"
                  style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  View in Author Dashboard →
                </a>
              </div>

              <p>Regards,<br/><strong>TOESS Editorial Team</strong></p>
            </div>
          </div>
        `,
      });

      console.log("✅ Editorial decision email sent to:", authorEmail);
      return { success: true, emailSent: true, messageId: info.messageId };

    } catch (error) {
      console.error("Editorial decision email error:", error);
      if (error instanceof functions.HttpsError) throw error;
      throw new functions.HttpsError("internal", `Error: ${error.message}`);
    }
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. NEW: Paper Published Notification
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
exports.notifyPaperPublished = functions.onCall(
  {
    secrets: [emailUser, emailPassword],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    console.log("PAPER PUBLISHED EMAIL STARTED");

    try {
      const auth = request.auth;
      if (!auth) throw new functions.HttpsError("unauthenticated", "User not authenticated");

      const { authorEmail, authorName, paperTitle, doi, volume, issue } = request.data;

      if (!authorEmail || !paperTitle) {
        throw new functions.HttpsError("invalid-argument", "authorEmail and paperTitle are required");
      }

      const emailUserValue = emailUser.value();
      const emailPasswordValue = emailPassword.value();
      const transporter = createTransporter(emailUserValue, emailPasswordValue);
      await transporter.verify();

      const info = await transporter.sendMail({
        from: `"TOESS Journal" <${emailUserValue}>`,
        to: authorEmail,
        subject: "Your Paper is Now Published — TOESS Journal 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #4f46e5, #2563eb); padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">🎉 Your Paper is Published!</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
              <p>Dear ${authorName || "Author"},</p>
              <p>We are delighted to inform you that your manuscript has been officially published in the <strong>Transactions on Evolutionary Smart Systems (TOESS)</strong> Journal.</p>

              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0;"><strong>Title:</strong> ${paperTitle}</p>
                ${volume ? `<p style="margin: 4px 0;"><strong>Volume:</strong> ${volume}${issue ? `, Issue ${issue}` : ""}</p>` : ""}
                ${doi ? `<p style="margin: 4px 0;"><strong>DOI:</strong> <a href="https://doi.org/${doi}" style="color: #4f46e5;">${doi}</a></p>` : ""}
                <p style="margin: 4px 0;"><strong>Published:</strong> ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>

              <p>Your research is now freely accessible to readers worldwide through our open-access platform.</p>

              <div style="margin: 24px 0; display: flex; gap: 12px;">
                <a href="https://toess-5b213.web.app/archives"
                  style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 12px;">
                  View Published Paper →
                </a>
                <a href="https://toess-5b213.web.app/dashboard/author"
                  style="background: white; color: #4f46e5; border: 1px solid #4f46e5; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Author Dashboard
                </a>
              </div>

              <p style="color: #6b7280; font-size: 13px;">Share your published work with your network to maximize its impact.</p>
              <p>Congratulations and thank you for contributing to TOESS Journal!</p>
              <p>Regards,<br/><strong>TOESS Editorial Team</strong></p>
            </div>
          </div>
        `,
      });

      console.log("✅ Paper published email sent to:", authorEmail);
      return { success: true, emailSent: true, messageId: info.messageId };

    } catch (error) {
      console.error("Paper published email error:", error);
      if (error instanceof functions.HttpsError) throw error;
      throw new functions.HttpsError("internal", `Error: ${error.message}`);
    }
  }
);