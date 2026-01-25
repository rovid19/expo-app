import { supabase } from "../services/supabase/supabaseClient";
import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const hasEbayConnection = async (req: Request, res: Response) => {
  const { userId } = req.query;

  console.log("userId", userId);

  const { data, error } = await supabase
    .from("ebay_accounts")
    .select("id")
    .eq("owner_id", userId)
    .eq("revoked", false)
    .maybeSingle();

  if (error) {
    console.error("Error checking eBay connection:", error);
    return res.status(500).json({ error: "Error checking eBay connection" });
  }

  console.log("data from ebay_accounts", data);

  return res.status(200).json({ hasEbayConnection: Boolean(data) });
};

export const startEbayOAuth = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  console.log(process.env.EBAY_CLIENT_ID, process.env.EBAY_REDIRECT_URI);

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  // Generate state (you should store this temporarily, e.g. Redis / DB)
  const state = crypto.randomUUID();

  const authUrl =
    "https://auth.ebay.com/oauth2/authorize?" +
    new URLSearchParams({
      client_id: process.env.EBAY_CLIENT_ID!, // PROD client id
      response_type: "code",
      redirect_uri: process.env.EBAY_REDIRECT_URI!, // PROD RuName
      scope: "https://api.ebay.com/oauth/api_scope",
      state: JSON.stringify({ userId }),
    }).toString();

  return res.json({ authUrl });
};

export const ebayOAuthCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const { userId } = JSON.parse(state as string);
  console.log(process.env.EBAY_CLIENT_ID, process.env.EBAY_REDIRECT_URI);

  if (!code) {
    return res.status(400).send("Missing OAuth code");
  }

  try {
    const tokenRes = await axios.post(
      "https://api.ebay.com/identity/v1/oauth2/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: process.env.EBAY_REDIRECT_URI!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
            ).toString("base64"),
        },
      }
    );

    const { refresh_token } = tokenRes.data;

    if (!refresh_token) {
      return res.status(400).send("No refresh token returned");
    }

    console.log("TOKEN RESPONSE", tokenRes.data);

    const { error } = await supabase.from("ebay_accounts").upsert({
      owner_id: userId,
      refresh_token,
      revoked: false,
    });

    if (error) {
      console.error("Error saving eBay account:", error);
      return res.status(500).send("Error saving eBay account");
    }

    // Redirect back to app (or success page)
    return res.redirect("dexly://ebay-success");
  } catch (err: any) {
    console.error("eBay OAuth callback error:", err.response?.data || err);
    return res.redirect("dexly://ebay-error");
  }
};

async function getEbayAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    "https://api.ebay.com/identity/v1/oauth2/token",
    "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
}

export async function searchEbayItems(req: Request, res: Response) {
  try {
    const { itemName } = req.body;

    if (!itemName || typeof itemName !== "string") {
      return res.status(400).json({ error: "Invalid itemName" });
    }

    const accessToken = await getEbayAccessToken();

    const ebayRes = await axios.get(
      "https://api.ebay.com/buy/browse/v1/item_summary/search",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
        },
        params: {
          q: itemName,
          limit: 50,
        },
      }
    );

    return res.json({
      query: itemName,
      count: ebayRes.data.itemSummaries?.length ?? 0,
      items: ebayRes.data.itemSummaries ?? [],
    });
  } catch (err: any) {
    console.error(err?.response?.data || err);
    return res.status(500).json({ error: "eBay search failed" });
  }
}
