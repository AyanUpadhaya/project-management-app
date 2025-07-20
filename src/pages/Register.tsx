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

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleRegister = async () => {
    try {
      setErrorMsg("");
      if ([email, password].some((field) => field.trim() == "")) {
        alert("Fields can't be empty");
        return;
      }
      if (!validateEmail(email)) {
        alert("Email isn't valid");
        return;
      }
      if (password.length < 6) {
        alert("Password should have minimum six character");
        return;
      }
      setLoading(true);
      const { data, error } = await signUp(email, password);

      if (error) {
        setErrorMsg(error.message);
        return;
      } else {
        console.log(data);
      }

      // ✅ Since user is authenticated right away (email confirmation disabled)
      navigate("/");
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
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your email and password for creating an account
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={handleRegister}
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
