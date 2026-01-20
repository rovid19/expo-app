"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scanController_1 = require("../controllers/scanController");
const router = express_1.default.Router();
router.post("/image-scan", scanController_1.scanImage);
router.post("/remove-photo-from-supabase", scanController_1.removePhotoFromSupabase);
exports.default = router;
