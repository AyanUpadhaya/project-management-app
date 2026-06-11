import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabase/supabaseClient";
import { Loader2Icon } from "lucide-react";

interface MailBody {
  to: string;
  subject: string;
  body: string;
}

async function sendEmail(body: MailBody) {
  const response = await fetch("/v1/functions/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send email");
  }

  return data;
}

export default function EmailSender() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleSendEmail = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please login first.",
          variant: "destructive",
        });
        return;
      }

      await sendEmail({
        to,
        subject,
        body,
      });

      toast({
        title: "Email sent successfully!",
        description: "Email has been sent.",
      });

      setTo("");
      setSubject("");
      setBody("");
    } catch (error: any) {
      console.error(error);

      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="to" className="text-right">
          To
        </Label>
        <Input
          id="to"
          className="col-span-3"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subject" className="text-right">
          Subject
        </Label>
        <Input
          id="subject"
          className="col-span-3"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="body" className="text-right">
          Body
        </Label>
        <Textarea
          id="body"
          className="col-span-3"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="attachment" className="text-right">
          Attachment
        </Label>
        <Input id="attachment" type="file" className="col-span-3" />
      </div>
      <div className="flex justify-end">
        <Button disabled={loading} onClick={handleSendEmail}>
          Send Email{" "}
          {loading && <Loader2Icon className="size-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
