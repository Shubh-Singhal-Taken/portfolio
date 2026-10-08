import { useEffect, useState } from "react";

/* A minimum-viable observable. Used for the few pieces of state that
   cross the tree sideways (the 3D hit-test feeding the ring cursor,
   the audio engine feeding the visualiser) where threading props
   through App would be noise. */

export type Signal<T> = {
  get: () => T;
  set: (value: T) => void;
  subscribe: (fn: (value: T) => void) => () => void;
};

export function createSignal<T>(initial: T): Signal<T> {
  let current = initial;
  const listeners = new Set<(value: T) => void>();

  return {
    get: () => current,
    set(value: T) {
      if (Object.is(value, current)) return;
      current = value;
      for (const fn of listeners) fn(value);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

export function useSignal<T>(signal: Signal<T>): T {
  const [value, setValue] = useState(signal.get);
  useEffect(() => signal.subscribe(setValue), [signal]);
  return value;
}

/** True while the pointer is over a solid object in the 3D scene. */
export const cursorHot = createSignal(false);
