import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import ProjectDetail from "@/components/ProjectDetail";
import Home from "./pages/Home";
import DashboardLayout from "./layout/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "@/services/PrivateRoute";
import GuestRoute from "./services/GuestRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <Routes>
            {/* dashboard */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardLayout></DashboardLayout>
                </PrivateRoute>
              }
            >
              <Route index element={<Home></Home>} />
              <Route path="/project/:id" element={<ProjectDetail />} />
            </Route>
            {/* login */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login></Login>
                </GuestRoute>
              }
            ></Route>
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPassword></ForgotPassword>
                </GuestRoute>
              }
            ></Route>
            <Route
              path="/reset-password"
              element={
                <ResetPassword></ResetPassword>
              }
            ></Route>
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register></Register>
                </GuestRoute>
              }
            ></Route>
            <Route path="*" element={<p>Not found</p>} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
