import { Request, Response } from "express";
import multer from "multer";
import { ScanItem } from "../services/openai/detectItem";
import fs from "fs";
import path from "path";
import { supabase } from "../services/supabase/supabaseClient";

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

export const removePhotoFromSupabase = async (req: Request, res: Response) => {
  const { uri } = req.body;
  console.log("removing photo from supabase", uri);
  if (!uri || typeof uri !== "string") {
    return res.status(400).json({ message: "Invalid uri" });
  }

  const marker = "/storage/v1/object/public/images/";
  const index = uri.indexOf(marker);
  if (index === -1) {
    return res.status(400).json({ message: "Invalid image url" });
  }

  const objectPath = decodeURIComponent(
    uri.slice(index + marker.length).split("?")[0]
  );

  // OPTIONAL but recommended: basic path safety
  if (!objectPath.includes("/")) {
    return res.status(400).json({ message: "Invalid object path" });
  }

  console.log("deleting (service role):", objectPath);

  const { data, error } = await supabase.storage
    .from("images")
    .remove([objectPath]);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Error removing image" });
  }

  res.status(200).json({
    message: "Image removed",
    removed: data, // may be [] even on success
  });
};
