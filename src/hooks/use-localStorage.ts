import { useState, useEffect } from "react";

type StorageValue<T> = T | null;

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [StorageValue<T>, (value: StorageValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<StorageValue<T>>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      if (storedValue === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error("Failed to write to localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
