export interface Item {
  detected_item: string;
  details: string;
  estimated_resale_price: number;
  price: number;
  confidence: number;
  image: string[] | null;
  category: "clothes" | "shoes" | "car" | "other";
  shoe_size?: number | string;
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl";
  is_sold?: boolean;
  owner_id?: string;
  created_at?: string;
  id: string;
  selling_price?: number;
  buying_price?: number;
  ebay_search_query?: string;
}
