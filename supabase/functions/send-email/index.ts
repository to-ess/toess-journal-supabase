// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:5173";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FROM = "TOESS Editorial System <noreply@toess.org>";

const base = (content: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;margin:0;padding:0}
  .wrap{max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:linear-gradient(135deg,#4f46e5,#2563eb);padding:32px 40px}
  .hdr h1{color:#fff;margin:0;font-size:22px;font-weight:700}
  .hdr p{color:#c7d2fe;margin:6px 0 0;font-size:14px}
  .body{padding:36px 40px;color:#1e293b}
  .body p{line-height:1.7;color:#475569;margin:0 0 16px}
  .box{background:#f1f5f9;border-left:4px solid #4f46e5;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0}
  .box p{margin:0;color:#1e293b;font-weight:500}
  .badge{display:inline-block;padding:6px 16px;border-radius:999px;font-size:13px;font-weight:600;margin:4px 0}
  .green{background:#dcfce7;color:#166534}
  .blue{background:#dbeafe;color:#1e40af}
  .orange{background:#ffedd5;color:#9a3412}
  .red{background:#fee2e2;color:#991b1b}
  .indigo{background:#e0e7ff;color:#3730a3}
  .yellow{background:#fef9c3;color:#854d0e}
  .btn{display:inline-block;background:#4f46e5;color:#fff!important;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;margin:8px 0}
  .ftr{background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0}
  .ftr p{color:#94a3b8;font-size:12px;margin:0;line-height:1.6}
  .divider{height:1px;background:#e2e8f0;margin:24px 0}
</style></head>
<body><div class="wrap">
  <div class="hdr"><h1>TOESS Editorial System</h1><p>Transactions on Evolutionary Smart Systems</p></div>
  <div class="body">${content}</div>
  <div class="ftr"><p>This is an automated message from the TOESS Editorial System.<br>Please do not reply. For queries, contact the editorial office at <a href="mailto:editor@toess.org">editor@toess.org</a></p></div>
</div></body></html>`;

const templates: Record<string, (n: any) => { subject: string; html: string }> =
  {
    welcome: (n) => ({
      subject: "Welcome to TOESS — Your Account is Ready",
      html: base(`
      <p>Dear ${n.recipient_name},</p>
      <p>Welcome to <strong>Transactions on Evolutionary Smart Systems (TOESS)</strong>! Your account has been created successfully.</p>
      <div class="box"><p>🎉 You're now registered as an author on our platform.</p></div>
      <p><strong>What you can do:</strong></p>
      <p>📄 Submit manuscripts for peer review<br>
         📊 Track your submission status<br>
         📬 Receive editorial decisions<br>
         📚 Access published papers in our archives</p>
      <a href="${SITE_URL}/dashboard" class="btn">Go to Your Dashboard</a>
      <p style="margin-top:20px">We look forward to receiving your research contributions!</p>
    `),
    }),

    submission: (n) => ({
      subject: `Manuscript Received — ${n.paper_title}`,
      html: base(`
      <p>Dear ${n.recipient_name},</p>
      <p>Thank you for submitting your manuscript to <strong>TOESS</strong>. We have successfully received it.</p>
      <div class="box"><p>📄 ${n.paper_title}</p></div>
      <p>Your manuscript is now in our editorial queue. You will receive updates as the review process progresses.</p>
      <div class="divider"></div>
      <p><strong>What happens next?</strong></p>
      <p>1️⃣ Initial editorial screening<br>
         2️⃣ Assignment to peer reviewers<br>
         3️⃣ Review process (typically 4–6 weeks)<br>
         4️⃣ Editorial decision notification</p>
      <a href="${SITE_URL}/dashboard" class="btn">Track Your Submission</a>
    `),
    }),

    review_assigned: (n) => ({
      subject: `Review Assignment — ${n.paper_title}`,
      html: base(`
      <p>Dear ${n.recipient_name},</p>
      <p>You have been selected as a peer reviewer for the following manuscript:</p>
      <div class="box"><p>📄 ${n.paper_title}</p></div>
      ${n.message ? `<p><strong>Review Deadline:</strong> ${new Date(n.message).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>` : ""}
      <p><strong>Review Guidelines:</strong></p>
      <p>• Evaluate originality, methodology, clarity, and significance<br>
         • Provide constructive feedback for the authors<br>
         • Maintain confidentiality of the manuscript<br>
         • Declare any conflicts of interest</p>
      <a href="${SITE_URL}/dashboard/reviewer" class="btn">Go to Reviewer Dashboard</a>
      <p style="margin-top:20px">Thank you for contributing to TOESS peer review!</p>
    `),
    }),

    review_submitted: (n) => ({
      subject: `Review Submitted — ${n.paper_title}`,
      html: base(`
      <p>Dear ${n.recipient_name},</p>
      <p>Your peer review has been successfully submitted for the following manuscript:</p>
      <div class="box"><p>📄 ${n.paper_title}</p></div>
      <p><span class="badge green">✓ Review Recorded</span></p>
      <p>The editorial team will now review your feedback and make a final decision. Thank you for your valuable contribution to the peer review process!</p>
      <a href="${SITE_URL}/dashboard/reviewer" class="btn">Back to Dashboard</a>
    `),
    }),

    reviewer_approved: (n) => ({
      subject: "Your Reviewer Application Has Been Approved 🎉",
      html: base(`
      <p>Dear ${n.recipient_name},</p>
      <p>Congratulations! Your application to become a reviewer for <strong>TOESS</strong> has been <strong>approved</strong>.</p>
      <p><span class="badge green">✓ Application Approved</span></p>
      <p>You can now log in to your reviewer dashboard to:</p>
      <p>📋 View papers assigned to you<br>
         📝 Submit peer reviews<br>
         📊 Track your review history</p>
      <a href="${SITE_URL}/dashboard/reviewer" class="btn">Go to Reviewer Dashboard</a>
      <p style="margin-top:20px">We appreciate your commitment to advancing research in evolutionary smart systems!</p>
    `),
    }),

    reviewer_rejected: (n) => ({
      subject: "Update on Your Reviewer Application",
      html: base(`
      <p>Dear ${n.recipient_name},</p>
      <p>Thank you for your interest in becoming a reviewer for <strong>TOESS</strong>.</p>
      <p>After careful consideration, we regret to inform you that your application has not been accepted at this time.</p>
      <p><span class="badge red">Application Not Accepted</span></p>
      ${
        n.message
          ? `
      <div class="divider"></div>
      <p><strong>Reason:</strong></p>
      <div class="box"><p>${n.message}</p></div>`
          : ""
      }
      <p>You are welcome to reapply in the future if your qualifications change. You may continue using TOESS as an author to submit manuscripts.</p>
      <a href="${SITE_URL}" class="btn">Return to TOESS</a>
    `),
    }),

    decision: (n) => {
      const msgLines = (n.message || "").split("\n");
      const decisionKey = msgLines[0]?.trim() || "reject";
      const editorComments = msgLines.slice(1).join("\n").trim();

      const decisionMap: Record<
        string,
        { label: string; badge: string; message: string }
      > = {
        accept: {
          label: "ACCEPTED",
          badge: "green",
          message:
            "Congratulations! Your manuscript has been accepted for publication in TOESS.",
        },
        reject: {
          label: "REJECTED",
          badge: "red",
          message:
            "After careful consideration, we regret that your manuscript cannot be accepted for publication at this time.",
        },
        "minor-revision": {
          label: "MINOR REVISION REQUIRED",
          badge: "blue",
          message:
            "Your manuscript requires minor revisions. Please address the reviewer comments and resubmit.",
        },
        "major-revision": {
          label: "MAJOR REVISION REQUIRED",
          badge: "orange",
          message:
            "Your manuscript requires major revisions. Please carefully address all reviewer comments and resubmit.",
        },
      };
      const info = decisionMap[decisionKey] || decisionMap["reject"];

      return {
        subject: `Editorial Decision — ${n.paper_title}`,
        html: base(`
        <p>Dear ${n.recipient_name},</p>
        <p>We have completed the peer review process for your manuscript:</p>
        <div class="box"><p>📄 ${n.paper_title}</p></div>
        <p><strong>Editorial Decision:</strong><br>
        <span class="badge ${info.badge}">${info.label}</span></p>
        <p>${info.message}</p>
        ${
          editorComments
            ? `
        <div class="divider"></div>
        <p><strong>Editor's Comments:</strong></p>
        <div class="box"><p style="white-space:pre-wrap">${editorComments}</p></div>`
            : ""
        }
        <a href="${SITE_URL}/dashboard" class="btn">View Full Decision</a>
      `),
      };
    },

    published: (n) => ({
      subject: `Your Paper Has Been Published — ${n.paper_title}`,
      html: base(`
      <p>Dear ${n.recipient_name},</p>
      <p>🎉 Congratulations! Your manuscript has been officially published in <strong>TOESS</strong>.</p>
      <div class="box"><p>📄 ${n.paper_title}</p></div>
      <p><span class="badge indigo">PUBLISHED</span></p>
      <p>Your research is now accessible to the global scientific community through our journal archives.</p>
      ${n.message && n.message !== "N/A" ? `<p><strong>DOI:</strong> ${n.message}</p>` : ""}
      <a href="${SITE_URL}/archives" class="btn">View in Archives</a>
      <p style="margin-top:20px">Thank you for your valuable contribution to TOESS!</p>
    `),
    }),
  };

const sendViaResend = async (to: string, subject: string, html: string) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return await res.json();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
  let notificationId: string | null = null;

  try {
    const payload = await req.json();
    const notification = payload.record || payload;

    if (!notification?.id) {
      return new Response(JSON.stringify({ error: "No notification record" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    notificationId = notification.id;

    if (notification.status !== "pending") {
      return new Response(JSON.stringify({ skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const templateFn = templates[notification.type];
    if (!templateFn) {
      await supabaseAdmin
        .from("email_notifications")
        .update({
          status: "failed",
          error_message: `Unknown type: ${notification.type}`,
        })
        .eq("id", notification.id);
      return new Response(JSON.stringify({ error: "Unknown email type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, html } = templateFn(notification);
    await sendViaResend(notification.recipient_email, subject, html);

    await supabaseAdmin
      .from("email_notifications")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", notification.id);

    console.log(
      `✅ Sent [${notification.type}] to ${notification.recipient_email}`,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Edge function error:", error);
    if (notificationId) {
      try {
        const supabaseAdmin = createClient(
          SUPABASE_URL!,
          SUPABASE_SERVICE_ROLE_KEY!,
        );
        await supabaseAdmin
          .from("email_notifications")
          .update({ status: "failed", error_message: error.message })
          .eq("id", notificationId);
      } catch (_) {}
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
