import express from "express";
import { scanImage, saveItem } from "../controllers/scanController";

const router = express.Router();

router.post("/image-scan", scanImage);
router.post("/save-item", saveItem);

export default router;
