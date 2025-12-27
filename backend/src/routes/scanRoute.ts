import express from "express";
import {
  scanImage,
  removePhotoFromSupabase,
} from "../controllers/scanController";

const router = express.Router();

router.post("/image-scan", scanImage);
router.post("/remove-photo-from-supabase", removePhotoFromSupabase);

export default router;
