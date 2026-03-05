import { supabase } from "./supabase";
import { sendSubmissionConfirmationEmail } from "./emailService";

/**
 * Create a manuscript submission
 */
export async function createSubmission(data) {
  console.log("📤 Creating submission:", data);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Step 1: Create paper
    const { data: paper, error: paperError } = await supabase
      .from("papers")
      .insert({
        title: data.title,
        abstract: data.abstract,
        article_type: data.articleType,
        category: data.category,
        keywords: data.keywords || [],
        submission_type: data.submissionType || "Regular Submission",
        special_issue_id: data.specialIssueId || null,
        manuscript_id: data.manuscriptId || null,
        file_url: data.fileUrl || null,
        status: "submitted",
        author_id: user.id,
      })
      .select()
      .single();

    if (paperError) throw paperError;

    // Step 2: Add co-authors
    if (data.authors && data.authors.length > 0) {
      const authorRows = data.authors.map((author) => ({
        paper_id: paper.id,
        full_name: `${author.firstName} ${author.lastName}`.trim(),
        email: author.email,
        institution: author.institution,
        is_corresponding: author.isCorresponding || false,
      }));
      const { error: authorsError } = await supabase
        .from("paper_authors")
        .insert(authorRows);
      if (authorsError) throw authorsError;
    }

    console.log("✅ Submission created:", paper.id);

    // Step 3: Send confirmation email (non-blocking)
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("email, given_name, family_name")
        .eq("id", user.id)
        .single();

      await sendSubmissionConfirmationEmail({
        paperId: paper.id,
        paperTitle: data.title,
        authorEmail: userData?.email,
        authorName: userData
          ? `${userData.given_name || ""} ${userData.family_name || ""}`.trim()
          : "Author",
      });
    } catch (emailError) {
      console.warn(
        "⚠️ Confirmation email failed (non-blocking):",
        emailError.message,
      );
    }

    return { success: true, paperId: paper.id };
  } catch (error) {
    console.error("❌ Submission error:", error);
    throw new Error(error.message || "Failed to submit manuscript");
  }
}

/**
 * Get all submissions for current author
 */
export async function getAuthorSubmissions(authorId) {
  try {
    const { data: papers, error: paperError } = await supabase
      .from("papers")
      .select("*")
      .eq("author_id", authorId)
      .order("created_at", { ascending: false });

    if (paperError) throw paperError;
    if (!papers || papers.length === 0) return [];

    const paperIds = papers.map((p) => p.id);
    const { data: authorsData } = await supabase
      .from("paper_authors")
      .select("*")
      .in("paper_id", paperIds);

    const authorsMap = {};
    (authorsData || []).forEach((a) => {
      if (!authorsMap[a.paper_id]) authorsMap[a.paper_id] = [];
      authorsMap[a.paper_id].push(a);
    });

    return papers.map((p) => ({
      ...p,
      paper_authors: authorsMap[p.id] || [],
    }));
  } catch (error) {
    console.error("Error in getAuthorSubmissions:", error);
    throw error;
  }
}

export const getMySubmissions = getAuthorSubmissions;

/**
 * Get all submissions (admin)
 */
export async function getAllSubmissions() {
  try {
    const { data: papers, error: paperError } = await supabase
      .from("papers")
      .select("*")
      .order("created_at", { ascending: false });

    if (paperError) throw paperError;
    if (!papers || papers.length === 0) return [];

    const paperIds = papers.map((p) => p.id);

    const { data: authorsData } = await supabase
      .from("paper_authors")
      .select("*")
      .in("paper_id", paperIds);

    const authorsMap = {};
    (authorsData || []).forEach((a) => {
      if (!authorsMap[a.paper_id]) authorsMap[a.paper_id] = [];
      authorsMap[a.paper_id].push(a);
    });

    const authorIds = [
      ...new Set(papers.map((p) => p.author_id).filter(Boolean)),
    ];
    let usersMap = {};

    if (authorIds.length > 0) {
      const { data: usersData } = await supabase
        .from("users")
        .select("id, email, given_name, family_name")
        .in("id", authorIds);
      (usersData || []).forEach((u) => {
        usersMap[u.id] = u;
      });
    }

    return papers.map((p) => ({
      ...p,
      paper_authors: authorsMap[p.id] || [],
      users: usersMap[p.author_id] || null,
    }));
  } catch (error) {
    console.error("Error getting all submissions:", error);
    throw error;
  }
}

/**
 * Get a single submission by ID
 */
export async function getSubmission(submissionId) {
  try {
    const { data: paper, error: paperError } = await supabase
      .from("papers")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (paperError) throw new Error("Submission not found");

    const { data: authorsData } = await supabase
      .from("paper_authors")
      .select("*")
      .eq("paper_id", submissionId);

    paper.paper_authors = authorsData || [];

    if (paper.author_id) {
      const { data: userData } = await supabase
        .from("users")
        .select("id, email, given_name, family_name")
        .eq("id", paper.author_id)
        .single();
      paper.users = userData || null;
    }

    return paper;
  } catch (error) {
    console.error("Error in getSubmission:", error);
    throw error;
  }
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(submissionId, status) {
  const { error } = await supabase
    .from("papers")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", submissionId);
  if (error) throw error;
}

/**
 * Update submission with any data
 */
export async function updateSubmission(submissionId, data) {
  const { error } = await supabase
    .from("papers")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", submissionId);
  if (error) throw error;
}

/**
 * Get all published papers (public)
 */
export async function getPublishedPapers() {
  try {
    const { data: papers, error } = await supabase
      .from("papers")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching published papers:", error);
      return [];
    }
    if (!papers || papers.length === 0) return [];

    const paperIds = papers.map((p) => p.id);
    const { data: authorsData } = await supabase
      .from("paper_authors")
      .select("*")
      .in("paper_id", paperIds);

    const authorsMap = {};
    (authorsData || []).forEach((a) => {
      if (!authorsMap[a.paper_id]) authorsMap[a.paper_id] = [];
      authorsMap[a.paper_id].push(a);
    });

    return papers.map((p) => ({ ...p, paper_authors: authorsMap[p.id] || [] }));
  } catch (error) {
    console.error("Error in getPublishedPapers:", error);
    return [];
  }
}

/**
 * Get submissions by status
 */
export async function getSubmissionsByStatus(status) {
  const { data: papers, error } = await supabase
    .from("papers")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!papers || papers.length === 0) return [];

  const paperIds = papers.map((p) => p.id);
  const { data: authorsData } = await supabase
    .from("paper_authors")
    .select("*")
    .in("paper_id", paperIds);

  const authorsMap = {};
  (authorsData || []).forEach((a) => {
    if (!authorsMap[a.paper_id]) authorsMap[a.paper_id] = [];
    authorsMap[a.paper_id].push(a);
  });

  return papers.map((p) => ({ ...p, paper_authors: authorsMap[p.id] || [] }));
}

export async function getPendingPapers() {
  return getSubmissionsByStatus("submitted");
}

/**
 * Delete a submission
 */
export async function deleteSubmission(submissionId) {
  const { error } = await supabase
    .from("papers")
    .delete()
    .eq("id", submissionId);
  if (error) throw error;
}

/**
 * Get submission by manuscript_id
 */
export async function getSubmissionByManuscriptId(manuscriptId) {
  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .single();
  if (error) throw error;
  return data;
}
