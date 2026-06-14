import {
  BookIcon,
  LogOutIcon,
  Moon,
  NotebookIcon,
  Sun,
  Bookmark,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "@/services/authService";
import { useDarkMode } from "@/context/DarkModeContext";
import SendMail from "@/components/SendMail";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

const DashboardLayout = () => {
  const { toggleDarkMode, isDark } = useDarkMode();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const MAIN_USER_ID = "38c6e5c1-6897-4075-acae-e591f827167f";
  const isMainUser = user && user?.id == MAIN_USER_ID;
  return (
    <div>
      <header className="py-4 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex max-w-screen-2xl mx-auto items-center">
          <div className="flex justify-between w-full px-4">
            <Link
              className="mr-6 flex items-center text-2xl font-bold space-x-2"
              to="/"
            >
              <span className="font-bold inline-block">DevNexus</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-3 items-center">
              <Button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button
                onClick={() => navigate("/bookmarks")}
                variant="default"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-900 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-white"></Bookmark>
                <span>Bookmarks</span>
              </Button>
              <Button
                onClick={() => navigate("/trello")}
                variant="default"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <BookIcon className="w-4 h-4 text-white"></BookIcon>
                <span>Trello</span>
              </Button>
              <Button
                onClick={() => navigate("/notes")}
                variant="default"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <NotebookIcon className="w-4 h-4 text-white"></NotebookIcon>
                <span>Notes</span>
              </Button>
              <Button
                onClick={() => signOut()}
                variant="destructive"
                className="flex gap-2"
              >
                <LogOutIcon className="w-4 h-4 text-white"></LogOutIcon>
                <span>Logout</span>
              </Button>

              {isMainUser && <SendMail />}
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="p-2"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 p-4">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  navigate("/bookmarks");
                  setMobileMenuOpen(false);
                }}
                variant="default"
                className="justify-start w-full flex items-center gap-2 px-4 py-2 bg-cyan-900 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-white"></Bookmark>
                <span>Bookmarks</span>
              </Button>
              <Button
                onClick={() => {
                  navigate("/trello");
                  setMobileMenuOpen(false);
                }}
                variant="default"
                className="justify-start w-full flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <BookIcon className="w-4 h-4 text-white"></BookIcon>
                <span>Trello</span>
              </Button>
              <Button
                onClick={() => {
                  navigate("/notes");
                  setMobileMenuOpen(false);
                }}
                variant="default"
                className="justify-start w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <NotebookIcon className="w-4 h-4 text-white"></NotebookIcon>
                <span>Notes</span>
              </Button>
              {isMainUser && (
                <div className="border-t border-border/40 mt-2 pt-2">
                  <SendMail />
                </div>
              )}
              <Button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                variant="destructive"
                className="justify-start w-full flex gap-2"
              >
                <LogOutIcon className="w-4 h-4 text-white"></LogOutIcon>
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </header>
      <main className="container max-w-screen-2xl mx-auto flex min-h-[calc(100vh_-_theme(spacing.14))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-6">
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default DashboardLayout;
