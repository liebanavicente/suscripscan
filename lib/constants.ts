import { Category, ExpenseCategory, Subscription } from "./types";
import { addDaysToTodayISODate } from "./dates";

// Tintas Risograph: se leen bien sobre papel y dan carácter a los gráficos.
export const CATEGORY_META: Record<
  Category,
  { label: string; color: string; icon: string }
> = {
  phone_internet: {
    label: "Teléfono e internet",
    color: "#0078bf",
    icon: "📱",
  },
  tv_streaming: {
    label: "Televisión y streaming",
    color: "#ff48b0",
    icon: "📺",
  },
  music: {
    label: "Música",
    color: "#f2a900",
    icon: "🎵",
  },
  ai_tools: {
    label: "IA y herramientas tecnológicas",
    color: "#00a95c",
    icon: "🤖",
  },
  software: {
    label: "Software",
    color: "#3255a4",
    icon: "💻",
  },
  gaming: {
    label: "Gaming",
    color: "#765ba7",
    icon: "🎮",
  },
  cloud_storage: {
    label: "Almacenamiento en la nube",
    color: "#00838a",
    icon: "☁️",
  },
  other: {
    label: "Otros",
    color: "#88806c",
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
    renewalDate: addDaysToTodayISODate(5),
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    price: 11.99,
    frequency: "monthly",
    renewalDate: addDaysToTodayISODate(12),
  },
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    category: "ai_tools",
    price: 20.0,
    frequency: "monthly",
    renewalDate: addDaysToTodayISODate(8),
  },
  {
    id: "disney",
    name: "Disney+",
    category: "tv_streaming",
    price: 11.99,
    frequency: "monthly",
    renewalDate: addDaysToTodayISODate(20),
  },
  {
    id: "icloud",
    name: "iCloud+",
    category: "cloud_storage",
    price: 2.99,
    frequency: "monthly",
    renewalDate: addDaysToTodayISODate(3),
  },
  {
    id: "movistar",
    name: "Movistar",
    category: "phone_internet",
    price: 45.0,
    frequency: "monthly",
    renewalDate: addDaysToTodayISODate(15),
  },
  {
    id: "adobe",
    name: "Adobe Creative Cloud",
    category: "software",
    price: 59.99,
    frequency: "monthly",
    renewalDate: addDaysToTodayISODate(25),
  },
  {
    id: "xbox",
    name: "Xbox Game Pass",
    category: "gaming",
    price: 14.99,
    frequency: "monthly",
    renewalDate: addDaysToTodayISODate(7),
  },
];

export const EXPENSE_CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; color: string; icon: string }
> = {
  alimentacion: { label: "Alimentación", color: "#f2a900", icon: "🛒" },
  transporte:   { label: "Transporte",   color: "#0078bf", icon: "🚗" },
  ocio:         { label: "Ocio",         color: "#ff48b0", icon: "🎉" },
  salud:        { label: "Salud",        color: "#00a95c", icon: "🏥" },
  hogar:        { label: "Hogar",        color: "#3255a4", icon: "🏠" },
  ropa:         { label: "Ropa",         color: "#765ba7", icon: "👗" },
  educacion:    { label: "Educación",    color: "#00838a", icon: "📚" },
  viajes:       { label: "Viajes",       color: "#ff6c2f", icon: "✈️" },
  otros:        { label: "Otros",        color: "#88806c", icon: "📦" },
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "alimentacion", "transporte", "ocio", "salud",
  "hogar", "ropa", "educacion", "viajes", "otros",
];

export const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "Mensual",
  annual: "Anual",
  quarterly: "Trimestral",
};
