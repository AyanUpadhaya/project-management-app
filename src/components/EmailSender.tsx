import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function EmailSender() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
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
        <Button onClick={handleSendEmail}>Send Email</Button>
      </div>
    </div>
  );
}