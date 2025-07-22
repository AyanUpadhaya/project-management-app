import { useEffect, useState } from "react";
import { supabase } from "@/superbase/supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const access_token = searchParams.get("access_token");

    if (access_token) {
      supabase.auth.setSession({ access_token, refresh_token: "" });
    }
  }, [searchParams]);

  const handleReset = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setStatus("Failed to update password: " + error.message);
      } else {
        toast({
          title: "Success",
          description: "Mail has been sent",
        });
        console.log(data);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-screen-2xl mx-auto flex min-h-[calc(100vh_-_theme(spacing.14))] flex-1 flex-col justify-center items-center gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter New Password</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2"
          />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button disabled={loading} onClick={handleReset} className="w-full">
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <p className="mt-2">{status}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
