export interface ScannedItem {
  detected_item: string;
  details: string;
  resale_price_min_usd: number;
  resale_price_max_usd: number;
  confidence: number;
  image: string;
}
