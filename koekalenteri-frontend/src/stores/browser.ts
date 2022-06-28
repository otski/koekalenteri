import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

const logger = console.log;

function readStorage(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch (e) {
    logger(e);
  }
  return null;
}

function writeStorage(storage: Storage, key: string, value: string | null): void {
  try {
    if (!value) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, value);
    }
  } catch (e) {
    logger(e);
  }
}

const useIsMounted = () => {
  const ref = useRef(false);
  useEffect(() => { ref.current = true }, []);
  return ref.current;
}

function useStorage(storage: Storage, key: string, defaultValue: string): [string | null, Setter<string | null>] {
  const isMounted = useIsMounted();
  const [storedValue, setValue] = useState<string | null>(readStorage(storage, key) || defaultValue);
  const handleStorageChange = useCallback((e: StorageEvent) => {
    if (e.storageArea === storage && e.key === key) {
      console.log('change', e);
      setValue(e.newValue);
    }
  }, [storage, key]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    const oldValue = readStorage(storage, key);
    if (storedValue === oldValue) {
      return;
    }
    writeStorage(storage, key, storedValue);
    if (storage === sessionStorage) {
      dispatchEvent(new StorageEvent('storage', { storageArea: storage, key, newValue: storedValue, oldValue }));
    }
  }, [storage, key, storedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [handleStorageChange]);

  const setValueWrap = (value: SetStateAction<string | null>) => {
    if (value !== storedValue) {
      setValue(value);
    }
  }

  return [storedValue, setValueWrap];
}

export const useLocalStorage = (key: string, defaultValue: string) => useStorage(localStorage, key, defaultValue);
export const useSessionStorage = (key: string, defaultValue: string) => useStorage(sessionStorage, key, defaultValue);
