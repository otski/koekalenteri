import { configure } from "mobx";
import { createContext, useContext, useMemo } from "react";
import { Setter, useLocalStorage, useSessionStorage } from './browser';
import { RootStore } from "./RootStore";

// Make sure TS is configured properly for MobX
if (!new class { x: any }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly');

// Configure MobX warnings (but not in tests, to reduce warnings)
const notInTest = process.env.NODE_ENV !== 'test';
configure({
  enforceActions: "always",
  computedRequiresReaction: false, //notInTest,
  reactionRequiresObservable: notInTest,
  observableRequiresReaction: false,
  safeDescriptors: true
});

const rootStoreContext = createContext({
  rootStore: new RootStore(),
});

export const useStores = () => useContext(rootStoreContext);

export const useLanguage = (defaultValue: string) => useLocalStorage('i18nextLng', defaultValue);
export const useSessionStarted = () => useSessionStorage('started', '');

export const useSessionBoolean = (key: string, defaultValue: boolean): [boolean, Setter<boolean>] => {
  const [stringValue, setStringValue] = useSessionStorage(key, defaultValue ? 'true' : '');
  const value = useMemo<boolean>(() => stringValue === 'true', [stringValue]);
  const setValue: Setter<boolean> = (newValue) => setStringValue(newValue ? 'true' : null);
  return [value, setValue];
}

export { useLocalStorage, useSessionStorage };

