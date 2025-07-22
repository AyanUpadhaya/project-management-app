import { useState } from "react";
// import { supabase } from "@/superbase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "@/services/sendPasswordResetEmail";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSubmit = async () => {
    try {
      setErrorMsg("");
      if ([email].some((field) => field.trim() == "")) {
        alert("Fields can't be empty");
        return;
      }
      if (!validateEmail(email)) {
        alert("Email isn't valid");
        return;
      }
     
      setLoading(true);
      const result = await sendPasswordResetEmail(email);

      if (!result.success) {
        setErrorMsg(result.message);
        return;
      } else {
         toast({
           title: "Success",
           description: "Mail has been sent",
         });
      }

      // ✅ Since user is authenticated right away (email confirmation disabled)
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-screen-2xl mx-auto flex min-h-[calc(100vh_-_theme(spacing.14))] flex-1 flex-col justify-center items-center gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
             
            </div>
          </form>
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          <Button onClick={() => navigate("/login")} variant="link">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}