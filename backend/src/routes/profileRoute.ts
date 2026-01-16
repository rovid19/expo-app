import express from "express";
import { sendReport } from "../controllers/profileController";

const router = express.Router();

router.post("/send-report", sendReport);

export default router;
