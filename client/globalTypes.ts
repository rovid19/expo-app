export interface ScannedItem {
  detected_item: string;
  details: string;
  resale_price_min: number;
  resale_price_max: number;
  confidence: number;
  image: string | string[];
}
