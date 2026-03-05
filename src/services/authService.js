import { supabase } from "./supabase";

/**
 * Register new user with email/password
 * ✅ Passes given_name and family_name as metadata so the
 *    handle_new_user() trigger can populate public.users automatically
 */
export const registerUser = async (
  email,
  password,
  givenName = "",
  familyName = "",
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        given_name: givenName,
        family_name: familyName,
      },
    },
  });
  if (error) throw error;
  return data.user;
};

/**
 * Login with email/password
 */
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
};

/**
 * Google OAuth — redirects browser to Google, then back to /auth/callback
 */
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) throw error;
};

/**
 * Logout
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Observe auth state changes
 */
export const observeAuth = (callback) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
  return () => subscription.unsubscribe();
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
