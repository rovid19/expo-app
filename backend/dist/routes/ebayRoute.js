"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ebayController_1 = require("../controllers/ebayController");
const router = express_1.default.Router();
router.get("/has-ebay-connection", ebayController_1.hasEbayConnection);
router.get("/oauth-start", ebayController_1.startEbayOAuth);
router.get("/oauth/callback", ebayController_1.ebayOAuthCallback);
exports.default = router;
