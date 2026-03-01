const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// 🔹 REPLACE THESE
const SUPABASE_URL = "https://hdxypyjowmbqoznkufan.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkeHlweWpvd21icW96bmt1ZmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzU5MTQsImV4cCI6MjA4NzkxMTkxNH0.QfvQ0Kdow2Alktcem2HtKVKR2WxvJf-ON7iczZCJd7U";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔹 Load JSON files
const users = JSON.parse(fs.readFileSync("users.json"));
const submissions = JSON.parse(fs.readFileSync("submissions.json"));
const reviewAssignments = JSON.parse(fs.readFileSync("reviewAssignments.json"));
const reviews = JSON.parse(fs.readFileSync("reviews.json"));
const reviewerRequests = JSON.parse(fs.readFileSync("reviewerRequests.json"));

// 🔹 Convert Firestore Timestamp → ISO
function convertFirestoreTimestamp(ts) {
  if (!ts || !ts._seconds) return null;
  return new Date(ts._seconds * 1000).toISOString();
}

/* ===========================
   USERS
=========================== */
async function migrateUsers() {
  for (const user of users) {
    const { error } = await supabase.from("users").upsert({
      firebase_uid: user.id,
      email: user.email,
      role: user.role
    });

    if (error) console.error("User error:", error);
  }
  console.log("✅ Users migrated");
}

/* ===========================
   PAPERS
=========================== */
async function migratePapers() {
  for (const paper of submissions) {
    const { error } = await supabase.from("papers").upsert({
      firebase_id: paper.id,
      title: paper.title,
      abstract: paper.abstract,
      article_type: paper.articleType,
      category: paper.category,
      manuscript_id: paper.manuscriptId,
      status: paper.reviewStatus || "submitted"
    });

    if (error) console.error("Paper error:", error);
  }
  console.log("✅ Papers migrated");
}

/* ===========================
   PAPER AUTHORS
=========================== */
async function migratePaperAuthors() {
  for (const paper of submissions) {
    const { data: paperData } = await supabase
      .from("papers")
      .select("id")
      .eq("firebase_id", paper.id)
      .single();

    if (!paperData) continue;

    if (paper.authors && paper.authors.length > 0) {
      for (const author of paper.authors) {
        const { error } = await supabase.from("paper_authors").insert({
          paper_id: paperData.id,
          full_name: `${author.firstName} ${author.lastName}`,
          email: author.email,
          institution: author.institution,
          is_corresponding: author.isCorresponding || false
        });

        if (error) console.error("Author error:", error);
      }
    }
  }
  console.log("✅ Paper authors migrated");
}

/* ===========================
   REVIEWER ASSIGNMENTS
=========================== */
async function migrateReviewerAssignments() {
  for (const assignment of reviewAssignments) {
    const { data: paperData } = await supabase
      .from("papers")
      .select("id")
      .eq("firebase_id", assignment.paperId)
      .single();

    if (!paperData) continue;

    const { data: reviewerData } = await supabase
      .from("users")
      .select("id")
      .eq("email", assignment.reviewerEmail)
      .single();

    if (!reviewerData) continue;

    const { error } = await supabase
      .from("reviewer_assignments")
      .upsert({
        firebase_id: assignment.id,
        paper_id: paperData.id,
        reviewer_id: reviewerData.id,
        assigned_at: convertFirestoreTimestamp(assignment.assignedAt),
        deadline: convertFirestoreTimestamp(assignment.deadline),
        status: assignment.status || "pending"
      });

    if (error) console.error("Assignment error:", error);
  }

  console.log("✅ Reviewer assignments migrated");
}

/* ===========================
   REVIEWS
=========================== */
async function migrateReviews() {
  for (const review of reviews) {
    const { data: paperData } = await supabase
      .from("papers")
      .select("id")
      .eq("firebase_id", review.paperId)
      .single();

    if (!paperData) continue;

    const { data: reviewerData } = await supabase
      .from("users")
      .select("id")
      .eq("email", review.reviewerEmail)
      .single();

    if (!reviewerData) continue;

    const { error } = await supabase
      .from("reviews")
      .upsert({
        firebase_id: review.id,
        paper_id: paperData.id,
        reviewer_id: reviewerData.id,
        clarity_rating: review.clarityRating,
        originality_rating: review.originalityRating,
        methodology_rating: review.methodologyRating,
        overall_rating: review.overallRating,
        recommendation: review.recommendation,
        strengths: review.strengths,
        weaknesses: review.weaknesses,
        confidential_comments: review.confidentialComments,
        submitted_at: convertFirestoreTimestamp(review.submittedAt)
      });

    if (error) console.error("Review error:", error);
  }

  console.log("✅ Reviews migrated");
}

/* ===========================
   REVIEWER REQUESTS
=========================== */
async function migrateReviewerRequests() {
  for (const request of reviewerRequests) {
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("firebase_uid", request.userId)
      .single();

    if (!userData) continue;

    const { error } = await supabase
      .from("reviewer_requests")
      .upsert({
        firebase_id: request.id,
        user_id: userData.id,
        designation: request.designation,
        institution: request.institution,
        qualifications: request.qualifications,
        status: request.status,
        created_at: convertFirestoreTimestamp(request.createdAt)
      });

    if (error) console.error("Reviewer request error:", error);
  }

  console.log("✅ Reviewer requests migrated");
}

/* ===========================
   RUN MIGRATION
=========================== */
async function runMigration() {

  // Uncomment what you want to run:

  // await migrateUsers();
  // await migratePapers();
  // await migratePaperAuthors();
  // await migrateReviewerAssignments();
  // await migrateReviews();
     await migrateReviewerRequests();

}

runMigration();