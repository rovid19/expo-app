"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasEbayConnection = exports.sendReport = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
const supabaseClient_1 = require("../services/supabase/supabaseClient");
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendReport = async (req, res) => {
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send report" });
    }
};
exports.sendReport = sendReport;
const hasEbayConnection = async (req, res) => {
    const { userId } = req.query;
    const { data, error } = await supabaseClient_1.supabase
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
exports.hasEbayConnection = hasEbayConnection;
