"use client";

import { Subscription } from "./types";
import { DEFAULT_SUBSCRIPTIONS } from "./constants";

const STORAGE_KEY = "suscripscan_subscriptions";

export function loadSubscriptions(): Subscription[] {
  if (typeof window === "undefined") return DEFAULT_SUBSCRIPTIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveSubscriptions(DEFAULT_SUBSCRIPTIONS);
      return DEFAULT_SUBSCRIPTIONS;
    }
    return JSON.parse(stored) as Subscription[];
  } catch {
    return DEFAULT_SUBSCRIPTIONS;
  }
}

export function saveSubscriptions(subscriptions: Subscription[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  } catch {
    // storage quota exceeded — silently fail
  }
}

export function generateId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
