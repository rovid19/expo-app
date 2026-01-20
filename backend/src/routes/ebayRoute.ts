import express from "express";
import {
  hasEbayConnection,
  startEbayOAuth,
  ebayOAuthCallback,
} from "../controllers/ebayController";

const router = express.Router();

router.get("/has-ebay-connection", hasEbayConnection);
router.get("/oauth-start", startEbayOAuth);
router.get("/oauth/callback", ebayOAuthCallback);

export default router;
