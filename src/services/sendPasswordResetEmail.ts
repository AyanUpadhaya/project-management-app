import { supabase } from "@/superbase/supabaseClient";

export const sendPasswordResetEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://trackproject-management.netlify.app/reset-password", // This should match your app route
  });

  if (error) {
    console.error("Reset email error:", error.message);
    return { success: false, message: error.message };
  }
  console.log(data);

  return { success: true, message: "Reset email sent" };
};
