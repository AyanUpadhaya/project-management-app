import ProjectDetail from "@/components/ProjectDetail";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { emptyBox } from "./assets/getAssets";
import Home from "./pages/Home";
import DashboardLayout from "./layout/DashboardLayout";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthProvider";
import Register from "./pages/Register";
import PrivateRoute from "@/services/PrivateRoute";

function App() {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  return (
    <>
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
              <Route
                index
                element={
                  <Home
                    emptyBox={emptyBox}
                  ></Home>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <ProjectDetail
                    projects={projects}
                    setProjects={setProjects}
                  />
                }
              />
            </Route>
            {/* login */}
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path="*" element={<p>Not found</p>} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
