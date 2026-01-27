import { supabase } from "../services/supabase/supabaseClient";
import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

interface Item {
  detected_item: string;
  details: string;
  estimated_resale_price: number;
  price: number;
  confidence: number;
  image: string[] | null;
  category: "clothes" | "shoes" | "car" | "other";
  shoe_size?: number | string;
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl";
  is_sold?: boolean;
  owner_id?: string;
  created_at?: string;
  id: string;
  selling_price?: number;
  buying_price?: number;
  ebay_search_query?: string;
}

import multer from "multer";
const upload = multer({ dest: "uploads/" });

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
      scope: [
        "https://api.ebay.com/oauth/api_scope",
        "https://api.ebay.com/oauth/api_scope/sell.inventory",
        "https://api.ebay.com/oauth/api_scope/sell.account",
      ].join(" "),
      state: JSON.stringify({ userId }),
    }).toString();

  return res.json({ authUrl });
};

export const ebayOAuthCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const { userId } = JSON.parse(state as string);
  console.log(process.env.EBAY_CLIENT_ID, process.env.EBAY_REDIRECT_URI);

  console.log("oauth callback");

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
    console.log("TOKEN RESPONSE", tokenRes.data);

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

export const listItemForUser = async (req: Request, res: Response) => {
  upload.array("files")(req, res, async (err) => {
    try {
      if (err)
        return res.status(500).json({ message: "Error uploading files" });
      if (!req.files || !(req.files instanceof Array))
        return res.status(400).json({ message: "No images provided" });

      const userId = req.body.userId;
      const item: Item = JSON.parse(req.body.item);
      if (!userId || !item)
        return res.status(400).json({ message: "Missing userId or item" });

      /* 1. Upload images */
      const imageUrls: string[] = [];
      for (const file of req.files) {
        const buffer = fs.readFileSync(path.resolve(file.path));
        const fileName = `ebay/${userId}/${crypto.randomUUID()}.jpg`;

        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, buffer, { contentType: file.mimetype });

        if (error) throw error;

        const { data } = supabase.storage.from("images").getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
        fs.unlinkSync(file.path);
      }

      /* 2. Refresh token */
      const { data: account } = await supabase
        .from("ebay_accounts")
        .select("refresh_token")
        .eq("owner_id", userId)
        .eq("revoked", false)
        .single();

      if (!account)
        return res.status(400).json({ message: "No eBay account connected" });

      const tokenRes = await axios.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: account.refresh_token,
          scope: [
            "https://api.ebay.com/oauth/api_scope",
            "https://api.ebay.com/oauth/api_scope/sell.inventory",
            "https://api.ebay.com/oauth/api_scope/sell.account",
          ].join(" "),
        }),
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
              ).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenRes.data.access_token;

      /* 5. List item */
      await listItemOnEbay(accessToken, item, imageUrls);

      res.json({ success: true });
    } catch (e: any) {
      console.error(e?.response?.data || e);
      res.status(500).json({ error: e?.response?.data || e.message });
    }
  });
};

async function getDefaultPolicies(accessToken: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
  };

  // Payment policies
  const paymentRes = await axios.get(
    "https://api.ebay.com/sell/account/v1/payment_policy?marketplace_id=EBAY_US",
    { headers }
  ); // returns paymentPolicies[] [web:1][web:3]
  const paymentPolicy =
    paymentRes.data.paymentPolicies?.find((p: any) => p.default === true) ??
    paymentRes.data.paymentPolicies?.[0];

  // Return policies
  const returnRes = await axios.get(
    "https://api.ebay.com/sell/account/v1/return_policy?marketplace_id=EBAY_US",
    { headers }
  ); // returns returnPolicies[] [web:3][web:6]
  const returnPolicy =
    returnRes.data.returnPolicies?.find((p: any) => p.default === true) ??
    returnRes.data.returnPolicies?.[0];

  // Fulfillment (shipping) policies
  const fulfillmentRes = await axios.get(
    "https://api.ebay.com/sell/account/v1/fulfillment_policy?marketplace_id=EBAY_US",
    { headers }
  ); // returns fulfillmentPolicies[] [web:3][web:13]
  const fulfillmentPolicy =
    fulfillmentRes.data.fulfillmentPolicies?.find(
      (p: any) => p.default === true
    ) ?? fulfillmentRes.data.fulfillmentPolicies?.[0];

  return {
    paymentPolicyId: paymentPolicy?.paymentPolicyId,
    returnPolicyId: returnPolicy?.returnPolicyId,
    fulfillmentPolicyId: fulfillmentPolicy?.fulfillmentPolicyId,
  };
}

/* ---------- LISTING ---------- */
async function listItemOnEbay(
  accessToken: string,
  item: Item,
  imageUrls: string[]
) {
  const sku = `${item.id}-${Date.now()}`;

  const { paymentPolicyId, returnPolicyId, fulfillmentPolicyId } =
    await getDefaultPolicies(accessToken);

  const merchantLocationKey = await getOrCreateMerchantLocation(
    accessToken,
    item.owner_id as string,
    "HR",
    "49210",
    "Zagreb"
  );

  const leafCategoryId = "48828";
  console.log("Using leaf category:", leafCategoryId); // Debug

  const inventoryHeaders = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    "Content-Language": "en-US",
  };

  // 1. Inventory item
  await axios.put(
    `https://api.ebay.com/sell/inventory/v1/inventory_item/${sku}`,
    {
      product: {
        title: item.detected_item.slice(0, 80),
        description: item.details || item.detected_item,
        imageUrls,
        condition: "3000",
        categoryId: "48828", // 👈 important
        conditionDescriptors: [
          {
            name: "Condition",
            values: ["Used"],
          },
        ],
      },
      availability: {
        shipToLocationAvailability: { quantity: 1 },
      },
    },
    { headers: inventoryHeaders }
  );

  // 2. Offer
  const offerRes = await axios.post(
    "https://api.ebay.com/sell/inventory/v1/offer",
    {
      sku,
      marketplaceId: "EBAY_US",
      format: "FIXED_PRICE",
      quantity: 1,
      merchantLocationKey,
      pricingSummary: {
        price: {
          value: item.selling_price ?? item.price,
          currency: "USD",
        },
      },
      categoryId: 48828,
      listingPolicies: {
        paymentPolicyId,
        returnPolicyId,
        fulfillmentPolicyId,
      },
    },
    { headers: inventoryHeaders }
  );

  // 3. Publish
  await axios.post(
    `https://api.ebay.com/sell/inventory/v1/offer/${offerRes.data.offerId}/publish`,
    {},
    { headers: inventoryHeaders }
  );
}

async function getOrCreateMerchantLocation(
  accessToken: string,
  userId: string,
  country: string,
  postalCode: string,
  city: string,
  stateOrProvince: string = city
): Promise<string> {
  const MERCHANT_LOCATION_KEY = `default-${userId.slice(-8)}`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
  };

  // 1. Check existing
  try {
    const locationsRes = await axios.get(
      "https://api.ebay.com/sell/inventory/v1/location",
      { headers }
    );
    const existing = locationsRes.data.locations?.find(
      (loc: any) => loc.merchantLocationKey === MERCHANT_LOCATION_KEY
    );
    if (existing) {
      console.log(`✅ Using existing: ${MERCHANT_LOCATION_KEY}`);
      return MERCHANT_LOCATION_KEY;
    }
  } catch (e) {
    console.warn("No locations found, creating...");
  }

  // 2. Create CORRECT structure
  try {
    const response = await axios.post(
      `https://api.ebay.com/sell/inventory/v1/location/${MERCHANT_LOCATION_KEY}`,
      {
        name: `Shipping ${city}`,
        location: {
          address: {
            country: country.toUpperCase(),
            postalCode,
            city,
            stateOrProvince,
          },
        },
        locationType: "WAREHOUSE", // FIXED: ROOT level, not in location [web:28]
      },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Location created:", MERCHANT_LOCATION_KEY);
    return MERCHANT_LOCATION_KEY;
  } catch (error: any) {
    console.error("🚨 ERROR:", error.response?.data?.errors);
    throw error;
  }
}
