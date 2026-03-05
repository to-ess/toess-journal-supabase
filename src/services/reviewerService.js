import { supabase } from "./supabase";
import {
  sendReviewerAssignedEmail,
  sendEditorialDecisionEmail,
} from "./emailService";

/* ================= REVIEWER REGISTRATION ================= */
export const registerAsReviewer = async (userId, formData) => {
  try {
    const { error } = await supabase.from("reviewer_requests").insert({
      user_id: userId,
      designation: formData.designation,
      institution: formData.institution,
      qualifications: formData.qualifications,
      status: "pending",
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error registering reviewer:", error);
    throw error;
  }
};

/* ================= GET REVIEWER REQUEST STATUS ================= */
export const getReviewerRequestStatus = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("reviewer_requests")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return null;
    return data;
  } catch (error) {
    console.error("Error getting reviewer request:", error);
    return null;
  }
};

/* ================= GET ALL REVIEWER REQUESTS (Admin) ================= */
export const getAllReviewerRequests = async () => {
  try {
    const { data, error } = await supabase
      .from("reviewer_requests")
      .select(`*, users (email, given_name, family_name)`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting reviewer requests:", error);
    throw error;
  }
};

/* ================= APPROVE REVIEWER (Admin) ================= */
export const approveReviewer = async (requestId, userId) => {
  try {
    const { error: requestError } = await supabase
      .from("reviewer_requests")
      .update({ status: "approved" })
      .eq("id", requestId);
    if (requestError) throw requestError;

    const { error: userError } = await supabase
      .from("users")
      .update({ role: "reviewer", updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (userError) throw userError;

    return { success: true };
  } catch (error) {
    console.error("Error approving reviewer:", error);
    throw error;
  }
};

/* ================= REJECT REVIEWER (Admin) ================= */
export const rejectReviewer = async (requestId, reason = "") => {
  try {
    const { error } = await supabase
      .from("reviewer_requests")
      .update({ status: "rejected" })
      .eq("id", requestId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error rejecting reviewer:", error);
    throw error;
  }
};

/* ================= GET APPROVED REVIEWERS ================= */
export const getRegisteredReviewers = async () => {
  try {
    const { data, error } = await supabase
      .from("reviewer_requests")
      .select(`*, users (id, email, given_name, family_name)`)
      .eq("status", "approved");
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting approved reviewers:", error);
    throw error;
  }
};

/* ================= ASSIGN PAPER TO REVIEWER (Admin) ================= */
export const assignPaperToReviewer = async (
  paperId,
  reviewerEmail,
  reviewerName,
  deadline,
) => {
  try {
    const { data: reviewer, error: reviewerError } = await supabase
      .from("users")
      .select("id")
      .eq("email", reviewerEmail)
      .single();
    if (reviewerError || !reviewer) throw new Error("Reviewer not found");

    const { data: assignment, error: assignError } = await supabase
      .from("reviewer_assignments")
      .insert({
        paper_id: paperId,
        reviewer_id: reviewer.id,
        assigned_at: new Date().toISOString(),
        deadline: new Date(deadline).toISOString(),
        status: "pending",
      })
      .select()
      .single();
    if (assignError) throw assignError;

    const { error: paperError } = await supabase
      .from("papers")
      .update({ status: "under_review", updated_at: new Date().toISOString() })
      .eq("id", paperId);
    if (paperError) throw paperError;

    const { data: paper } = await supabase
      .from("papers")
      .select("title")
      .eq("id", paperId)
      .single();

    await sendReviewerAssignedEmail({
      reviewerEmail,
      reviewerName,
      paperTitle: paper?.title || "Untitled",
      paperId,
      deadline,
    });

    return { success: true, assignmentId: assignment.id };
  } catch (error) {
    console.error("Error assigning paper:", error);
    throw error;
  }
};

/* ================= GET ALL ASSIGNMENTS (Admin) ================= */
export const getAllAssignments = async () => {
  try {
    const { data: assignments, error } = await supabase
      .from("reviewer_assignments")
      .select("*")
      .order("assigned_at", { ascending: false });

    if (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }

    if (!assignments || assignments.length === 0) return [];

    const reviewerIds = [
      ...new Set(assignments.map((a) => a.reviewer_id).filter(Boolean)),
    ];
    let reviewersData = [];

    if (reviewerIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, given_name, family_name")
        .in("id", reviewerIds);

      if (usersError) {
        console.error("Error fetching reviewers:", usersError);
      } else {
        reviewersData = users || [];
      }
    }

    const reviewersMap = {};
    reviewersData.forEach((u) => {
      reviewersMap[u.id] = u;
    });

    const paperIds = [
      ...new Set(assignments.map((a) => a.paper_id).filter(Boolean)),
    ];
    let papersData = [];

    if (paperIds.length > 0) {
      const { data: papers, error: papersError } = await supabase
        .from("papers")
        .select("id, title, status")
        .in("id", paperIds);

      if (papersError) {
        console.error("Error fetching papers:", papersError);
      } else {
        papersData = papers || [];
      }
    }

    const papersMap = {};
    papersData.forEach((p) => {
      papersMap[p.id] = p;
    });

    return assignments.map((a) => ({
      ...a,
      users: reviewersMap[a.reviewer_id] || null,
      papers: papersMap[a.paper_id] || null,
    }));
  } catch (error) {
    console.error("Error getting all assignments:", error);
    throw error;
  }
};

/* ================= GET ASSIGNMENTS FOR REVIEWER ================= */
export const getReviewerAssignments = async (email) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    if (userError || !userData)
      throw new Error("User not found for email: " + email);

    const { data: assignments, error: assignError } = await supabase
      .from("reviewer_assignments")
      .select("*")
      .eq("reviewer_id", userData.id)
      .order("assigned_at", { ascending: false });

    if (assignError) throw assignError;
    if (!assignments || assignments.length === 0) return [];

    const paperIds = [
      ...new Set(assignments.map((a) => a.paper_id).filter(Boolean)),
    ];

    const { data: papersData, error: papersError } = await supabase
      .from("papers")
      .select(
        "id, title, abstract, article_type, category, keywords, status, file_url",
      )
      .in("id", paperIds);

    if (papersError) {
      console.error("Error fetching papers:", papersError);
    }

    const papersMap = {};
    (papersData || []).forEach((p) => {
      papersMap[p.id] = p;
    });

    const { data: authorsData, error: authorsError } = await supabase
      .from("paper_authors")
      .select("paper_id, full_name, email, institution, is_corresponding")
      .in("paper_id", paperIds);

    if (authorsError) {
      console.error("Error fetching authors:", authorsError);
    }

    const authorsMap = {};
    (authorsData || []).forEach((a) => {
      if (!authorsMap[a.paper_id]) authorsMap[a.paper_id] = [];
      authorsMap[a.paper_id].push(a);
    });

    return assignments.map((a) => {
      const p = papersMap[a.paper_id];
      const authors = authorsMap[a.paper_id] || [];
      const correspondingAuthor =
        authors.find((au) => au.is_corresponding) || authors[0];

      return {
        ...a,
        reviewSubmitted: a.status === "completed",
        paper: p
          ? {
              id: p.id,
              title: p.title,
              abstract: p.abstract,
              article_type: p.article_type,
              category: p.category,
              keywords: Array.isArray(p.keywords)
                ? p.keywords
                : p.keywords
                  ? p.keywords
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean)
                  : [],
              fileUrl: p.file_url || null,
              authorName: correspondingAuthor?.full_name || "",
              authorEmail: correspondingAuthor?.email || "",
              authorInstitution: correspondingAuthor?.institution || "",
            }
          : null,
      };
    });
  } catch (error) {
    console.error("Error getting reviewer assignments:", error);
    throw error;
  }
};

/* ================= SUBMIT REVIEW (Reviewer) ================= */
export const submitReview = async (assignmentId, reviewData) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", reviewData.reviewerEmail)
      .single();
    if (userError || !userData) throw new Error("Reviewer user not found");

    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        paper_id: reviewData.paperId,
        reviewer_id: userData.id,
        originality_rating: reviewData.originalityRating,
        methodology_rating: reviewData.methodologyRating,
        clarity_rating: reviewData.clarityRating,
        overall_rating: reviewData.overallRating,
        recommendation: reviewData.recommendation,
        strengths: reviewData.strengths,
        weaknesses: reviewData.weaknesses,
        detailed_comments: reviewData.detailedComments,
        confidential_comments: reviewData.confidentialComments || "",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (reviewError) throw reviewError;

    const { error: assignError } = await supabase
      .from("reviewer_assignments")
      .update({ status: "completed" })
      .eq("id", assignmentId);
    if (assignError) throw assignError;

    return { success: true, reviewId: review.id };
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

/* ================= GET REVIEWS FOR PAPER (Admin) ================= */
export const getReviewsForPaper = async (paperId) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`*, users (email, given_name, family_name)`)
      .eq("paper_id", paperId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting reviews for paper:", error);
    throw error;
  }
};

/* ================= GET ALL REVIEWED PAPERS (Admin decision page) ================= */
export const getPapersWithReviews = async () => {
  try {
    // Step 1: Fetch papers
    const { data: papers, error: paperError } = await supabase
      .from("papers")
      .select("*")
      .order("created_at", { ascending: false });

    if (paperError) throw paperError;
    if (!papers || papers.length === 0) return [];

    // Step 2: Fetch reviews for all papers
    const { data: reviews, error: reviewError } = await supabase
      .from("reviews")
      .select("*");

    if (reviewError) {
      console.error("Error fetching reviews:", reviewError);
    }

    // Filter papers that have reviews
    const reviewsMap = {};
    (reviews || []).forEach((r) => {
      if (!reviewsMap[r.paper_id]) reviewsMap[r.paper_id] = [];
      reviewsMap[r.paper_id].push(r);
    });

    const papersWithReviews = papers.filter(
      (p) => reviewsMap[p.id] && reviewsMap[p.id].length > 0,
    );

    if (papersWithReviews.length === 0) return [];

    // Step 3: Get paper IDs for next queries
    const paperIds = papersWithReviews.map((p) => p.id);

    // Step 4: Fetch editorial decisions
    const { data: decisionsData, error: decisionsError } = await supabase
      .from("editorial_decisions")
      .select("*")
      .in("paper_id", paperIds);

    if (decisionsError) {
      console.error("Error fetching editorial decisions:", decisionsError);
    }

    const decisionsMap = {};
    (decisionsData || []).forEach((d) => {
      decisionsMap[d.paper_id] = d;
    });

    // Step 5: Fetch paper_authors separately
    const { data: authorsData, error: authorsError } = await supabase
      .from("paper_authors")
      .select("*")
      .in("paper_id", paperIds);

    if (authorsError) {
      console.error("Error fetching authors:", authorsError);
    }

    const authorsMap = {};
    (authorsData || []).forEach((a) => {
      if (!authorsMap[a.paper_id]) authorsMap[a.paper_id] = [];
      authorsMap[a.paper_id].push(a);
    });

    // Step 6: Fetch reviewers for reviews
    const reviewIds = [];
    (reviews || []).forEach((r) => {
      if (paperIds.includes(r.paper_id)) {
        reviewIds.push(r.reviewer_id);
      }
    });

    let reviewersData = [];
    const uniqueReviewerIds = [...new Set(reviewIds.filter(Boolean))];

    if (uniqueReviewerIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, given_name, family_name")
        .in("id", uniqueReviewerIds);

      if (usersError) {
        console.error("Error fetching reviewers:", usersError);
      } else {
        reviewersData = users || [];
      }
    }

    const reviewersMap = {};
    reviewersData.forEach((u) => {
      reviewersMap[u.id] = u;
    });

    // Step 7: Fetch paper authors user data for authorName
    const { data: paperAuthorsData, error: paperAuthorsError } = await supabase
      .from("users")
      .select("id, email, given_name, family_name")
      .in("id", papersWithReviews.map((p) => p.author_id).filter(Boolean));

    if (paperAuthorsError) {
      console.error("Error fetching paper authors:", paperAuthorsError);
    }

    const paperAuthorsMap = {};
    (paperAuthorsData || []).forEach((u) => {
      paperAuthorsMap[u.id] = u;
    });

    // Step 8: Combine all data
    return papersWithReviews.map((p) => ({
      ...p,
      paper_authors: authorsMap[p.id] || [],
      // Attach full author user object so admin pages
      // (e.g. editorial decisions & publish flow) can
      // access `paper.users.email`, `given_name`, etc.
      users: paperAuthorsMap[p.author_id] || null,
      reviews: (reviewsMap[p.id] || []).map((r) => ({
        ...r,
        users: reviewersMap[r.reviewer_id] || null,
      })),
      editorialDecision: decisionsMap[p.id]?.decision || null,
      editorialComments: decisionsMap[p.id]?.comments || null,
      authorName:
        `${paperAuthorsMap[p.author_id]?.given_name || ""} ${paperAuthorsMap[p.author_id]?.family_name || ""}`.trim() ||
        "N/A",
    }));
  } catch (error) {
    console.error("Error getting papers with reviews:", error);
    throw error;
  }
};

/* ================= ADMIN FINAL DECISION ================= */
export const makeEditorialDecision = async (
  paperId,
  editorId,
  decision,
  comments = "",
) => {
  try {
    const newStatus =
      decision === "accept"
        ? "accepted"
        : decision === "reject"
          ? "rejected"
          : "revision_requested";

    // Step 1: Update paper status
    const { error: paperError } = await supabase
      .from("papers")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", paperId);
    if (paperError) throw paperError;

    // Step 2: Insert editorial decision
    const { error: decisionError } = await supabase
      .from("editorial_decisions")
      .insert({
        paper_id: paperId,
        editor_id: editorId,
        decision,
        comments,
        decided_at: new Date().toISOString(),
      });
    if (decisionError) throw decisionError;

    // Step 3: Fetch paper and author info for email
    const { data: paper } = await supabase
      .from("papers")
      .select("title, author_id")
      .eq("id", paperId)
      .single();

    // Step 4: Send email notification (non-blocking)
    if (paper && paper.author_id) {
      const { data: userData } = await supabase
        .from("users")
        .select("email, given_name, family_name")
        .eq("id", paper.author_id)
        .single();

      if (userData) {
        try {
          await sendEditorialDecisionEmail({
            authorEmail: userData.email,
            authorName:
              `${userData.given_name || ""} ${userData.family_name || ""}`.trim(),
            paperTitle: paper.title,
            decision,
            comments,
          });
        } catch (emailError) {
          console.warn(
            "⚠️ Email notification failed, but decision was recorded:",
            emailError.message,
          );
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error making editorial decision:", error);
    throw error;
  }
};
