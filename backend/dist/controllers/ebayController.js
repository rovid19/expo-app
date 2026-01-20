"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ebayOAuthCallback = exports.startEbayOAuth = exports.hasEbayConnection = void 0;
const supabaseClient_1 = require("../services/supabase/supabaseClient");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const hasEbayConnection = async (req, res) => {
    const { userId } = req.query;
    console.log("userId", userId);
    const { data, error } = await supabaseClient_1.supabase
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
exports.hasEbayConnection = hasEbayConnection;
const startEbayOAuth = async (req, res) => {
    const userId = req.query.userId;
    console.log(process.env.EBAY_CLIENT_ID, process.env.EBAY_REDIRECT_URI);
    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }
    // Generate state (you should store this temporarily, e.g. Redis / DB)
    const state = crypto_1.default.randomUUID();
    const authUrl = "https://auth.sandbox.ebay.com/oauth2/authorize?" +
        new URLSearchParams({
            client_id: process.env.EBAY_CLIENT_ID,
            response_type: "code",
            redirect_uri: process.env.EBAY_REDIRECT_URI, // must match eBay app
            scope: "https://api.ebay.com/oauth/api_scope",
            state,
        }).toString();
    return res.json({ authUrl });
};
exports.startEbayOAuth = startEbayOAuth;
const ebayOAuthCallback = async (req, res) => {
    const { code, state, userId } = req.query;
    console.log(process.env.EBAY_CLIENT_ID, process.env.EBAY_REDIRECT_URI);
    if (!code || !userId) {
        return res.status(400).send("Missing OAuth code or userId");
    }
    try {
        const tokenRes = await axios_1.default.post("https://api.ebay.com/identity/v1/oauth2/token", new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.EBAY_REDIRECT_URI,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " +
                    Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString("base64"),
            },
        });
        const { refresh_token } = tokenRes.data;
        if (!refresh_token) {
            return res.status(400).send("No refresh token returned");
        }
        await supabaseClient_1.supabase.from("ebay_accounts").upsert({
            owner_id: userId,
            refresh_token,
            revoked: false,
            updated_at: new Date().toISOString(),
        });
        // Redirect back to app (or success page)
        return res.redirect(`${process.env.APP_URL}/ebay-success`);
    }
    catch (err) {
        console.error("eBay OAuth callback error:", err.response?.data || err);
        return res.redirect(`${process.env.APP_URL}/ebay-error`);
    }
};
exports.ebayOAuthCallback = ebayOAuthCallback;
