const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// ============================================================
// CONFIG — fill these in
// ============================================================
const SUPABASE_URL = "https://hdxypyjowmbqoznkufan.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkeHlweWpvd21icW96bmt1ZmFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMzNTkxNCwiZXhwIjoyMDg3OTExOTE0fQ.iB0CdTCWyL9GTdSp0L8AjyquTJUDMMYMXE0M_NlVpW8"; // use service_role key, NOT anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ============================================================
// LOAD JSON FILES (exported from Firebase)
// ============================================================
const users            = JSON.parse(fs.readFileSync("users.json"));
const submissions      = JSON.parse(fs.readFileSync("submissions.json"));
const reviewAssignments = JSON.parse(fs.readFileSync("reviewAssignments.json"));
const reviews          = JSON.parse(fs.readFileSync("reviews.json"));
const reviewerRequests = JSON.parse(fs.readFileSync("reviewerRequests.json"));

// ============================================================
// HELPERS
// ============================================================

// Convert Firestore timestamp → ISO string
function toISO(ts) {
  if (!ts) return null;
  if (ts._seconds) return new Date(ts._seconds * 1000).toISOString();
  if (ts instanceof Date) return ts.toISOString();
  return null;
}

// Simple logger
function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }
function err(context, error) { console.error(`❌ ERROR in ${context}:`, error?.message || error); }

// Map to track firebase_uid → supabase uuid
const firebaseToSupabaseUID = {};

// ============================================================
// STEP 1 — MIGRATE USERS
// Creates auth.users first, then public.users
// ============================================================
async function migrateUsers() {
  log("Starting user migration...");
  let success = 0;
  let failed = 0;

  for (const user of users) {
    try {
      // 1a. Create in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: "ChangeMe@123!", // temporary password — they should reset
        email_confirm: true,       // mark email as confirmed
        user_metadata: { role: user.role }
      });

      if (authError) {
        // If user already exists in auth, try to find them
        if (authError.message?.includes("already been registered")) {
          const { data: existing } = await supabase.auth.admin.listUsers();
          const found = existing?.users?.find(u => u.email === user.email);
          if (found) {
            firebaseToSupabaseUID[user.id] = found.id;
            log(`⚠️  User already exists, mapped: ${user.email}`);
            continue;
          }
        }
        err(`auth createUser (${user.email})`, authError);
        failed++;
        continue;
      }

      const supabaseUID = authData.user.id;
      firebaseToSupabaseUID[user.id] = supabaseUID;

      // 1b. Insert into public.users
      const { error: dbError } = await supabase.from("users").upsert({
        id: supabaseUID,
        email: user.email,
        role: user.role || "author",
        given_name: user.firstName || user.givenName || null,
        family_name: user.lastName || user.familyName || null,
        created_at: toISO(user.createdAt) || new Date().toISOString(),
        updated_at: toISO(user.updatedAt) || new Date().toISOString()
      });

      if (dbError) { err(`public.users insert (${user.email})`, dbError); failed++; continue; }

      success++;
      log(`✅ User migrated: ${user.email} (${user.role})`);

    } catch (e) {
      err(`migrateUsers (${user.email})`, e);
      failed++;
    }
  }

  // Save the UID map to disk in case script crashes later
  fs.writeFileSync("uid_map.json", JSON.stringify(firebaseToSupabaseUID, null, 2));
  log(`✅ Users done — ${success} success, ${failed} failed`);
}

// ============================================================
// STEP 2 — MIGRATE PAPERS
// ============================================================
async function migratePapers() {
  log("Starting paper migration...");
  let success = 0;
  let failed = 0;

  for (const paper of submissions) {
    try {
      // Look up the supabase UUID for the author
      const authorSupabaseId = firebaseToSupabaseUID[paper.authorId] || null;

      const { error } = await supabase.from("papers").upsert({
        firebase_id: paper.id,
        title: paper.title || "Untitled",
        abstract: paper.abstract || null,
        article_type: paper.articleType || null,
        category: paper.category || null,
        manuscript_id: paper.manuscriptId || null,
        status: paper.reviewStatus || "submitted",
        author_id: authorSupabaseId,
        created_at: toISO(paper.createdAt) || new Date().toISOString(),
        updated_at: toISO(paper.updatedAt) || new Date().toISOString()
      });

      if (error) { err(`papers (${paper.id})`, error); failed++; continue; }

      success++;
      log(`✅ Paper migrated: ${paper.title}`);

    } catch (e) {
      err(`migratePapers (${paper.id})`, e);
      failed++;
    }
  }

  log(`✅ Papers done — ${success} success, ${failed} failed`);
}

// ============================================================
// STEP 3 — MIGRATE PAPER AUTHORS
// ============================================================
async function migratePaperAuthors() {
  log("Starting paper authors migration...");
  let success = 0;
  let failed = 0;

  for (const paper of submissions) {
    try {
      if (!paper.authors || paper.authors.length === 0) continue;

      // Get the supabase paper ID
      const { data: paperData, error: paperErr } = await supabase
        .from("papers")
        .select("id")
        .eq("firebase_id", paper.id)
        .single();

      if (paperErr || !paperData) {
        err(`paper lookup for authors (${paper.id})`, paperErr);
        failed++;
        continue;
      }

      for (const author of paper.authors) {
        const { error } = await supabase.from("paper_authors").insert({
          paper_id: paperData.id,
          full_name: `${author.firstName || ""} ${author.lastName || ""}`.trim(),
          email: author.email || null,
          institution: author.institution || null,
          is_corresponding: author.isCorresponding || false
        });

        if (error) { err(`paper_authors (${paper.id})`, error); failed++; continue; }
        success++;
      }

    } catch (e) {
      err(`migratePaperAuthors (${paper.id})`, e);
      failed++;
    }
  }

  log(`✅ Paper authors done — ${success} success, ${failed} failed`);
}

// ============================================================
// STEP 4 — MIGRATE REVIEWER ASSIGNMENTS
// ============================================================
async function migrateReviewerAssignments() {
  log("Starting reviewer assignments migration...");
  let success = 0;
  let failed = 0;

  for (const assignment of reviewAssignments) {
    try {
      // Get supabase paper ID
      const { data: paperData, error: paperErr } = await supabase
        .from("papers")
        .select("id")
        .eq("firebase_id", assignment.paperId)
        .single();

      if (paperErr || !paperData) {
        err(`paper lookup for assignment (${assignment.id})`, paperErr);
        failed++;
        continue;
      }

      // Get reviewer by email
      const { data: reviewerData, error: reviewerErr } = await supabase
        .from("users")
        .select("id")
        .eq("email", assignment.reviewerEmail)
        .single();

      if (reviewerErr || !reviewerData) {
        err(`reviewer lookup (${assignment.reviewerEmail})`, reviewerErr);
        failed++;
        continue;
      }

      const { error } = await supabase.from("reviewer_assignments").upsert({
        firebase_id: assignment.id,
        paper_id: paperData.id,
        reviewer_id: reviewerData.id,
        assigned_at: toISO(assignment.assignedAt) || new Date().toISOString(),
        deadline: toISO(assignment.deadline) || null,
        status: assignment.status || "pending"
      });

      if (error) { err(`reviewer_assignments (${assignment.id})`, error); failed++; continue; }

      success++;
      log(`✅ Assignment migrated: ${assignment.reviewerEmail}`);

    } catch (e) {
      err(`migrateReviewerAssignments (${assignment.id})`, e);
      failed++;
    }
  }

  log(`✅ Reviewer assignments done — ${success} success, ${failed} failed`);
}

// ============================================================
// STEP 5 — MIGRATE REVIEWS
// ============================================================
async function migrateReviews() {
  log("Starting reviews migration...");
  let success = 0;
  let failed = 0;

  for (const review of reviews) {
    try {
      // Get supabase paper ID
      const { data: paperData, error: paperErr } = await supabase
        .from("papers")
        .select("id")
        .eq("firebase_id", review.paperId)
        .single();

      if (paperErr || !paperData) {
        err(`paper lookup for review (${review.id})`, paperErr);
        failed++;
        continue;
      }

      // Get reviewer by email
      const { data: reviewerData, error: reviewerErr } = await supabase
        .from("users")
        .select("id")
        .eq("email", review.reviewerEmail)
        .single();

      if (reviewerErr || !reviewerData) {
        err(`reviewer lookup for review (${review.reviewerEmail})`, reviewerErr);
        failed++;
        continue;
      }

      const { error } = await supabase.from("reviews").upsert({
        firebase_id: review.id,
        paper_id: paperData.id,
        reviewer_id: reviewerData.id,
        clarity_rating: review.clarityRating || null,
        originality_rating: review.originalityRating || null,
        methodology_rating: review.methodologyRating || null,
        overall_rating: review.overallRating || null,
        recommendation: review.recommendation || null,
        strengths: review.strengths || null,
        weaknesses: review.weaknesses || null,
        confidential_comments: review.confidentialComments || null,
        submitted_at: toISO(review.submittedAt) || new Date().toISOString()
      });

      if (error) { err(`reviews (${review.id})`, error); failed++; continue; }

      success++;
      log(`✅ Review migrated: ${review.id}`);

    } catch (e) {
      err(`migrateReviews (${review.id})`, e);
      failed++;
    }
  }

  log(`✅ Reviews done — ${success} success, ${failed} failed`);
}

// ============================================================
// STEP 6 — MIGRATE REVIEWER REQUESTS
// ============================================================
async function migrateReviewerRequests() {
  log("Starting reviewer requests migration...");
  let success = 0;
  let failed = 0;

  for (const request of reviewerRequests) {
    try {
      // In Firebase, reviewerRequests doc ID = firebase UID of the user
      // So we look up by firebase UID in our map
      const supabaseUID = firebaseToSupabaseUID[request.id] || 
                          firebaseToSupabaseUID[request.userId] || null;

      if (!supabaseUID) {
        err(`reviewer request user lookup (${request.id})`, "No matching supabase UID found");
        failed++;
        continue;
      }

      const { error } = await supabase.from("reviewer_requests").upsert({
        firebase_id: request.id,
        user_id: supabaseUID,
        designation: request.designation || null,
        institution: request.institution || null,
        qualifications: request.qualifications || null,
        status: request.status || "pending",
        created_at: toISO(request.createdAt) || new Date().toISOString()
      });

      if (error) { err(`reviewer_requests (${request.id})`, error); failed++; continue; }

      success++;
      log(`✅ Reviewer request migrated: ${request.id}`);

    } catch (e) {
      err(`migrateReviewerRequests (${request.id})`, e);
      failed++;
    }
  }

  log(`✅ Reviewer requests done — ${success} success, ${failed} failed`);
}

// ============================================================
// STEP 7 — VERIFY MIGRATION
// ============================================================
async function verifyMigration() {
  log("Verifying migration...");

  const tables = [
    "users", "papers", "paper_authors",
    "reviewer_assignments", "reviews", "reviewer_requests"
  ];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) { err(`verify ${table}`, error); continue; }
    log(`📊 ${table}: ${count} rows`);
  }

  // Check for papers with no author_id (broken links)
  const { data: orphanedPapers } = await supabase
    .from("papers")
    .select("id, title, firebase_id")
    .is("author_id", null);

  if (orphanedPapers?.length > 0) {
    console.warn(`⚠️  ${orphanedPapers.length} papers have no author_id:`);
    orphanedPapers.forEach(p => console.warn(`   - ${p.title} (firebase_id: ${p.firebase_id})`));
  } else {
    log("✅ All papers have a linked author");
  }

  log("✅ Verification complete");
}

async function run() {
  try {
    if (fs.existsSync("uid_map.json")) {
      const saved = JSON.parse(fs.readFileSync("uid_map.json"));
      Object.assign(firebaseToSupabaseUID, saved);
      log("📂 Loaded existing UID map from uid_map.json");
    }

    await migrateReviewerAssignments();
    await migrateReviews();
    await verifyMigration();

    log("🎉 Done!");
  } catch (e) {
    console.error("💥 Fatal error:", e);
  }
}

run();