import express from "express";
import { sendReport, deleteAccount } from "../controllers/profileController";

const router = express.Router();

router.post("/send-report", sendReport);
router.delete("/delete-account", deleteAccount);

export default router;
