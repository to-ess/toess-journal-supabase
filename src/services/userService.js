import { supabase } from "./supabase";

const ADMIN_EMAIL = "kmkrphd@gmail.com";

/**
 * Save user profile with role
 * Called after registration/login to ensure profile exists
 */
export const saveUserProfile = async (user) => {
  const role = user.email === ADMIN_EMAIL ? "admin" : "author";

  const { error } = await supabase.from("users").upsert({
    id: user.id,
    email: user.email,
    role
  }, { onConflict: "id", ignoreDuplicates: false });

  if (error) throw error;
  return role;
};

/**
 * Get user role from public.users
 */
export const getUserRole = async (uid) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", uid)
      .single();

    if (error || !data) {
      // Fallback — recreate profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const role = user.email === ADMIN_EMAIL ? "admin" : "author";
        await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          role
        });
        return role;
      }
      return null;
    }

    return data.role;
  } catch (error) {
    console.error("Error getting user role:", error);
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === ADMIN_EMAIL) return "admin";
    return "author";
  }
};

/**
 * Get full user profile
 */
export const getUserProfile = async (uid) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", uid)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid, updates) => {
  const { error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", uid);

  if (error) throw error;
};