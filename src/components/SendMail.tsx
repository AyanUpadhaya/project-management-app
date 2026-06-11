import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MailIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import EmailSender from "./EmailSender";
const SendMail = () => {
  return (
    <>
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
    </>
  );
};

export default SendMail;
