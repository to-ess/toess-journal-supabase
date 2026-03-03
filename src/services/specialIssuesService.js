import { supabase } from "./supabase";

/* ==================================================
   CREATE SPECIAL ISSUE (Admin)
================================================== */
export async function createSpecialIssue(data) {
  try {
    const { data: issue, error } = await supabase
      .from("special_issues")
      .insert({
        ...data,
        status: "active",
        submission_count: 0
      })
      .select()
      .single();

    if (error) throw error;
    return issue;
  } catch (error) {
    console.error("Error creating special issue:", error);
    throw error;
  }
}

/* ==================================================
   GET ACTIVE SPECIAL ISSUES (Author dropdown)
================================================== */
export async function getActiveSpecialIssues() {
  try {
    const { data, error } = await supabase
      .from("special_issues")
      .select("*")
      .eq("status", "active")
      .order("deadline", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting active special issues:", error);
    return [];
  }
}

/* ==================================================
   GET ALL SPECIAL ISSUES (Admin)
================================================== */
export async function getAllSpecialIssues() {
  try {
    const { data, error } = await supabase
      .from("special_issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting all special issues:", error);
    throw error;
  }
}

/* ==================================================
   GET SINGLE SPECIAL ISSUE
================================================== */
export async function getSpecialIssue(id) {
  try {
    const { data, error } = await supabase
      .from("special_issues")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error("Special issue not found");
    return data;
  } catch (error) {
    console.error("Error getting special issue:", error);
    throw error;
  }
}

/* ==================================================
   UPDATE SPECIAL ISSUE
================================================== */
export async function updateSpecialIssue(id, data) {
  try {
    const { error } = await supabase
      .from("special_issues")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating special issue:", error);
    throw error;
  }
}

/* ==================================================
   DELETE SPECIAL ISSUE
================================================== */
export async function deleteSpecialIssue(id) {
  try {
    const { error } = await supabase
      .from("special_issues")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting special issue:", error);
    throw error;
  }
}

/* ==================================================
   INCREMENT SUBMISSION COUNT
================================================== */
export async function incrementSpecialIssueCount(id) {
  try {
    const { data: issue } = await supabase
      .from("special_issues")
      .select("submission_count")
      .eq("id", id)
      .single();

    if (!issue) return;

    await supabase
      .from("special_issues")
      .update({
        submission_count: (issue.submission_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
  } catch (error) {
    console.error("Error incrementing submission count:", error);
  }
}