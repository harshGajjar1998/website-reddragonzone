"use client";

import { useSyncExternalStore } from "react";

/** Products selected for comparison, kept in the browser so the choice survives page changes. */
export const COMPARE_MIN = 2;
export const COMPARE_MAX = 3;

const KEY = "rdz-compare";

type CompareState = {
  /** Product ids, see compareId() in data/compare.ts */
  ids: string[];
  /** Page to return to when the comparison is emptied */
  returnTo: string | null;
};

const EMPTY: CompareState = { ids: [], returnTo: null };
const listeners = new Set<() => void>();
let state: CompareState | null = null;

function read(): CompareState {
  if (state) return state;
  try {
    state = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    state = EMPTY;
  }
  return state!;
}

function write(next: CompareState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the selection still works for this page view
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  // Keeps other open tabs in step
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    state = null;
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const useCompareState = () => useSyncExternalStore(subscribe, read, () => EMPTY);

/** False on the server and the first client render, when the saved selection isn't readable yet. */
export const useCompareReady = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

export function addToCompare(id: string) {
  const current = read();
  if (current.ids.includes(id) || current.ids.length >= COMPARE_MAX) return;
  write({ ...current, ids: [...current.ids, id] });
}

export function removeFromCompare(id: string) {
  const current = read();
  write({ ...current, ids: current.ids.filter((item) => item !== id) });
}

export function setCompareReturn(returnTo: string) {
  write({ ...read(), returnTo });
}
