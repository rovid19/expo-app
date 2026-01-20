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

export const hasEbayConnection = async (
  req: Request,
  res: Response
): Promise<boolean> => {
  const { userId } = req.query;

  const { data, error } = await supabase
    .from("ebay_accounts")
    .select("id")
    .eq("owner_id", userId)
    .eq("revoked", false)
    .maybeSingle();

  if (error) {
    console.error("Error checking eBay connection:", error);
    return false;
  }

  return Boolean(data);
};
