import express from "express";
import { scanImage } from "../controllers/scanController";

const router = express.Router();

router.post("/image-scan", scanImage);

export default router;
