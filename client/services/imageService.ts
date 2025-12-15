import RNFS from "react-native-fs";
import { Platform } from "react-native";

export interface ImageProcessingResult {
  base64: string;
  mimeType: string;
  originalUri: string;
}

const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5MB
const MAX_DIMENSION = 2048;

export class ImageService {
  static async convertToBase64(uri: string): Promise<string> {
    try {
      let filePath = uri;

      if (uri.startsWith("file://")) {
        filePath = uri.replace("file://", "");
      }

      const base64 = await RNFS.readFile(filePath, "base64");
      return base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      throw new Error(`Failed to convert image: ${error}`);
    }
  }

  static async processImage(uri: string): Promise<ImageProcessingResult> {
    try {
      const base64 = await this.convertToBase64(uri);
      const mimeType = this.getMimeType(uri);

      return {
        base64,
        mimeType,
        originalUri: uri,
      };
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }

  static async processImages(
    images: string | string[]
  ): Promise<ImageProcessingResult[]> {
    const imageArray = Array.isArray(images) ? images : [images];

    const results: ImageProcessingResult[] = [];

    for (const uri of imageArray) {
      try {
        const processed = await this.processImage(uri);
        results.push(processed);
      } catch (error) {
        console.error(`Failed to process image ${uri}:`, error);
      }
    }

    return results;
  }

  static getMimeType(uri: string): string {
    const extension = uri.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      case "heic":
        return "image/heic";
      default:
        return "image/jpeg";
    }
  }

  static async getImageSize(uri: string): Promise<number> {
    try {
      let filePath = uri;

      if (uri.startsWith("file://")) {
        filePath = uri.replace("file://", "");
      }

      const stats = await RNFS.stat(filePath);
      return parseInt(String(stats.size), 10);
    } catch (error) {
      console.error("Error getting image size:", error);
      return 0;
    }
  }

  static createDataUrl(base64: string, mimeType: string): string {
    return `data:${mimeType};base64,${base64}`;
  }

  static async validateImage(uri: string): Promise<boolean> {
    try {
      const size = await this.getImageSize(uri);

      if (size === 0) {
        console.error("Image file is empty or cannot be read");
        return false;
      }

      if (size > MAX_IMAGE_SIZE) {
        console.warn(`Image size ${size} exceeds maximum ${MAX_IMAGE_SIZE}`);
      }

      return true;
    } catch (error) {
      console.error("Image validation failed:", error);
      return false;
    }
  }

  static async prepareImagesForUpload(
    images: string | string[]
  ): Promise<{ dataUrls: string[]; processedImages: ImageProcessingResult[] }> {
    const processedImages = await this.processImages(images);

    const dataUrls = processedImages.map((img) =>
      this.createDataUrl(img.base64, img.mimeType)
    );

    return {
      dataUrls,
      processedImages,
    };
  }
}

export default ImageService;
