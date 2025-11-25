// src/Login.js
import { useState } from "react";
import { signIn } from "@/services/authService";

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
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleLogin = async () => {
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

      const { data, error } = await signIn(email, password);

      if (error) {
        setErrorMsg(error.message);
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate("/");
      }
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
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
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
            disabled={loading}
            onClick={handleLogin}
            type="submit"
            className="w-full"
          >
            {loading ? "Loging.." : "Login"}
          </Button>
          <Button onClick={() => navigate("/register")} variant="link">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
