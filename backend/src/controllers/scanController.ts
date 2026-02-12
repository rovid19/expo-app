import { Request, Response } from "express";
import multer from "multer";
import { ScanItem } from "../services/openai/detectItem";
import fs from "fs";
import path from "path";
import { supabase } from "../services/supabase/supabaseClient";
import { searchEbayItems } from "./ebayController";
import axios from "axios";
const upload = multer({ dest: "uploads/" });

export const scanImage = async (req: Request, res: Response) => {
  console.log("scanning image");

  upload.single("file")(req, res, async (err) => {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    if (err) return res.status(500).json({ message: "Error uploading file" });
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const photoUri = req.body.photoUri;
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

    /*let scannedItem = {
      detected_item: "Macbook Air m2 8gb 256gb",
      details: "Macbook air m2 in excellent condition",
      estimated_resale_price: 100,
      price: 100,
      confidence: 1,
      image: [photoUri],
      category: "electronics",
      ebay_search_query: "Macbook Air m2 8gb 256gb",
      size: "",
      shoe_size: 0,
      id: Math.random().toString(36).substr(2, 9),
    };*/

    // inject image into scannedItem
    //scannedItem.image = base64Image;
    scannedItem.size = "";
    scannedItem.shoe_size = 0;
    scannedItem.price = 0;
    scannedItem.id = Math.random().toString(36).substr(2, 9);
    scannedItem.image = [photoUri];
    scannedItem.estimated_resale_price =
      (await findRealListingPrice(scannedItem.ebay_search_query)) ??
      scannedItem.estimated_resale_price;
    scannedItem.detected_item =
      scannedItem.detected_item.charAt(0).toUpperCase() +
      scannedItem.detected_item.slice(1);

    console.log("scannedItem", scannedItem);

    /* setTimeout(() => {
      res.status(200).json({ scannedItem });
    }, 3500);*/

    res.status(200).json({ scannedItem });
  });
};

const findRealListingPrice = async (itemName: string) => {
  const response = await axios.post(
    "http://localhost:3000/api/ebay/get-similar-listings",
    { itemName },
  );

  const listings = response.data.items ?? [];

  const prices = listings
    .map((item: any) => Number(item?.price?.value))
    .filter((v: number) => Number.isFinite(v));

  if (prices.length === 0) {
    return null; // explicit: no usable price data
  }

  const averagePrice =
    prices.reduce((sum: number, v: number) => sum + v, 0) / prices.length;

  return Math.round(averagePrice);
};
