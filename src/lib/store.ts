import type { MockStore } from '../types.js';

const memory = new Map<string, unknown>();

export const store: MockStore = {
  get<T>(key: string): T | undefined {
    return memory.get(key) as T | undefined;
  },
  set<T>(key: string, value: T): void {
    memory.set(key, value);
  },
  delete(key: string): void {
    memory.delete(key);
  },
  clear(): void {
    memory.clear();
  },
  has(key: string): boolean {
    return memory.has(key);
  },
  snapshot(): Record<string, unknown> {
    return Object.fromEntries(memory);
  },
};

export function seedStore(): void {
  store.set('items', [
    { id: '1', name: 'Alpha' },
    { id: '2', name: 'Beta' },
  ]);
}
