export interface ScannedItem {
  detected_item: string;
  details: string;
  resale_price_min: number;
  resale_price_max: number;
  price: number;
  confidence: number;
  image: Image | Image[];
  category: "clothes" | "shoes" | "car" | "other";
  shoe_size?: number | string;
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl";
  isSold?: boolean;
  owner_id?: string;
  created_at?: string;
  id?: string;
}

export type Image = {
  id: number;
  url: string;
};
