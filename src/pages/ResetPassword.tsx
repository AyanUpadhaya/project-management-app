import { useEffect, useState } from "react";
import { supabase } from "@/superbase/supabaseClient";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const access_token = searchParams.get("access_token");

    if (access_token) {
      supabase.auth.setSession({ access_token, refresh_token: "" });
    }
  }, [searchParams]);

  const handleReset = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setStatus("Failed to update password: " + error.message);
    } else {
      setStatus("Password updated successfully!");
      console.log(data);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Reset Password</h2>
      <Input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border p-2"
      />
      <Button
        onClick={handleReset}
        className="ml-2 px-4 py-2 bg-blue-500 text-white"
      >
        Submit
      </Button>
      <p className="mt-2">{status}</p>
    </div>
  );
}
