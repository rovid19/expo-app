import { Resend } from "resend";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { supabase } from "../services/supabase/supabaseClient";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendReport = async (req: Request, res: Response) => {
  const { description } = req.body;

  if (!description || description.length < 5) {
    return res.status(400).json({ message: "Invalid description" });
  }

  try {
    await resend.emails.send({
      from: "Bug Reports <onboarding@resend.dev>",
      to: ["roberto.vidovic0@gmail.com"],
      subject: "New Bug Report",
      text: description,
    });

    res.status(200).json({ message: "Report sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send report" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  console.log("Delete account requested for:", userId);

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await supabase.auth.admin.deleteUser(userId);
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};
