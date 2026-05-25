export type PaymentFrequency = "monthly" | "annual" | "quarterly";

export type Category =
  | "phone_internet"
  | "tv_streaming"
  | "music"
  | "ai_tools"
  | "software"
  | "gaming"
  | "cloud_storage"
  | "other";

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  price: number;
  frequency: PaymentFrequency;
  renewalDate: string; // ISO date string
  color?: string;
}

export interface CategoryStats {
  category: Category;
  label: string;
  total: number;
  count: number;
  color: string;
}
