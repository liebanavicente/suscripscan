import { Category, Subscription } from "./types";

export const CATEGORY_META: Record<
  Category,
  { label: string; color: string; icon: string }
> = {
  phone_internet: {
    label: "Teléfono e internet",
    color: "#6366f1",
    icon: "📱",
  },
  tv_streaming: {
    label: "Televisión y streaming",
    color: "#ec4899",
    icon: "📺",
  },
  music: {
    label: "Música",
    color: "#f59e0b",
    icon: "🎵",
  },
  ai_tools: {
    label: "IA y herramientas tecnológicas",
    color: "#10b981",
    icon: "🤖",
  },
  software: {
    label: "Software",
    color: "#3b82f6",
    icon: "💻",
  },
  gaming: {
    label: "Gaming",
    color: "#8b5cf6",
    icon: "🎮",
  },
  cloud_storage: {
    label: "Almacenamiento en la nube",
    color: "#06b6d4",
    icon: "☁️",
  },
  other: {
    label: "Otros",
    color: "#64748b",
    icon: "📦",
  },
};

export const CATEGORIES: Category[] = [
  "phone_internet",
  "tv_streaming",
  "music",
  "ai_tools",
  "software",
  "gaming",
  "cloud_storage",
  "other",
];

export const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "netflix",
    name: "Netflix",
    category: "tv_streaming",
    price: 17.99,
    frequency: "monthly",
    renewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    price: 11.99,
    frequency: "monthly",
    renewalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    category: "ai_tools",
    price: 20.0,
    frequency: "monthly",
    renewalDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: "disney",
    name: "Disney+",
    category: "tv_streaming",
    price: 11.99,
    frequency: "monthly",
    renewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: "icloud",
    name: "iCloud+",
    category: "cloud_storage",
    price: 2.99,
    frequency: "monthly",
    renewalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: "movistar",
    name: "Movistar",
    category: "phone_internet",
    price: 45.0,
    frequency: "monthly",
    renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: "adobe",
    name: "Adobe Creative Cloud",
    category: "software",
    price: 59.99,
    frequency: "monthly",
    renewalDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: "xbox",
    name: "Xbox Game Pass",
    category: "gaming",
    price: 14.99,
    frequency: "monthly",
    renewalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
];

export const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "Mensual",
  annual: "Anual",
  quarterly: "Trimestral",
};
