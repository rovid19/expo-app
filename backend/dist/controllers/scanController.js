"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePhotoFromSupabase = exports.saveItem = exports.scanImage = void 0;
const multer_1 = __importDefault(require("multer"));
const detectItem_1 = require("../services/openai/detectItem");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const supabaseClient_1 = require("../services/supabase/supabaseClient");
const upload = (0, multer_1.default)({ dest: "uploads/" });
const scanImage = async (req, res) => {
    console.log("scanning image");
    upload.single("file")(req, res, async (err) => {
        if (err)
            return res.status(500).json({ message: "Error uploading file" });
        if (!req.file)
            return res.status(400).json({ message: "No file provided" });
        const filePath = req.file.path;
        const fileBuffer = fs_1.default.readFileSync(path_1.default.resolve(filePath));
        /* // convert to base64
        const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString(
          "base64"
        )}`;*/
        // create File for OpenAI
        const fileObj = new File([fileBuffer], req.file.originalname, {
            type: req.file.mimetype,
        });
        let scannedItem = await new detectItem_1.ScanItem().detectItem(fileObj, "euro");
        // inject image into scannedItem
        //scannedItem.image = base64Image;
        scannedItem.size = "";
        scannedItem.shoe_size = 0;
        scannedItem.price = 0;
        res.status(200).json({ scannedItem });
    });
};
exports.scanImage = scanImage;
const saveItem = async (req, res) => { };
exports.saveItem = saveItem;
const removePhotoFromSupabase = async (req, res) => {
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
    const objectPath = decodeURIComponent(uri.slice(index + marker.length).split("?")[0]);
    // OPTIONAL but recommended: basic path safety
    if (!objectPath.includes("/")) {
        return res.status(400).json({ message: "Invalid object path" });
    }
    console.log("deleting (service role):", objectPath);
    const { data, error } = await supabaseClient_1.supabase.storage
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
exports.removePhotoFromSupabase = removePhotoFromSupabase;
