// netlify/functions/send-email.ts
import type { Config, Context } from "@netlify/functions";
import nodemailer from "nodemailer";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  console.log(context);

  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "to, subject and body are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Netlify.env.get("GMAIL_USER"),
        pass: Netlify.env.get("GMAIL_APP_PASSWORD"),
      },
    });

    await transporter.sendMail({
      from: Netlify.env.get("GMAIL_USER"),
      to,
      subject,
      html: body,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const config: Config = {
  path: "/v1/functions/send-email",
};
