import { LogOutIcon, MailIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EmailSender from "@/components/EmailSender";
import { Link, Outlet } from "react-router-dom";
import { signOut } from "@/services/authService";

const DashboardLayout = () => {
  return (
    <div>
      <header className="py-4 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex max-w-screen-2xl mx-auto items-center">
          <div className="flex justify-between w-full px-4">
            <Link className="mr-6 flex items-center space-x-2" to="/">
              <span className="hidden font-bold sm:inline-block">
                Project Management
              </span>
            </Link>

            <div className="flex gap-3 items-center">
              <Button
                onClick={() => signOut()}
                variant="destructive"
                className="flex gap-2"
              >
                <LogOutIcon className="w-4 h-4 text-white"></LogOutIcon>
                <span>Logout</span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MailIcon className="w-4 h-4"></MailIcon>
                    <span>Send Email</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Send Email</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to send an email.
                    </DialogDescription>
                  </DialogHeader>
                  <EmailSender />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>
      <main className="container max-w-screen-2xl mx-auto flex min-h-[calc(100vh_-_theme(spacing.14))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default DashboardLayout;
