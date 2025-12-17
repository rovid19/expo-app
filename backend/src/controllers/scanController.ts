import { Request, Response } from "express";
import multer from "multer";
import { ScanItem } from "../services/openai/detectItem";
import fs from "fs";
import path from "path";

const upload = multer({ dest: "uploads/" });

export const scanImage = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (err) => {
    if (err) return res.status(500).json({ message: "Error uploading file" });
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(path.resolve(filePath));

    /* // convert to base64
    const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString(
      "base64"
    )}`;*/

    // create File for OpenAI
    const fileObj = new File([fileBuffer], req.file.originalname, {
      type: req.file.mimetype,
    });

    let scannedItem = await new ScanItem().detectItem(fileObj, "euro");

    // inject image into scannedItem
    //scannedItem.image = base64Image;
    scannedItem.size = "";
    scannedItem.shoe_size = 0;
    scannedItem.price = 0;

    res.status(200).json({ scannedItem });
  });
};

export const saveItem = async (req: Request, res: Response) => {};
