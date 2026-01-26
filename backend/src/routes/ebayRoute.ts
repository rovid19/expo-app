import express from "express";
import {
  hasEbayConnection,
  startEbayOAuth,
  ebayOAuthCallback,
  searchEbayItems,
  listItemForUser,
} from "../controllers/ebayController";

const router = express.Router();

router.get("/has-ebay-connection", hasEbayConnection);
router.get("/oauth-start", startEbayOAuth);
router.get("/oauth/callback", ebayOAuthCallback);
router.post("/get-similar-listings", searchEbayItems);
router.post("/auto-list-on-ebay", listItemForUser);

export default router;
