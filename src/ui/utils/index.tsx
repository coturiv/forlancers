import { v4 as uuidv4 } from 'uuid';

export function loadPackage<T extends {}>(name: string) {
  try {
    return typeof window.require === 'function' ? (window.require(name) as T) : null;
  } catch (e) {
    console.log(`Package "${name}" does not exist!`, e);
  }
}

export const uuid = () => uuidv4();
