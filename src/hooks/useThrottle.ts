import { useRef, useCallback } from "react";

export function useThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
) {
  const lastRan = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRan.current >= limit) {
        fn(...args);
        lastRan.current = now;
      }
    },
    [fn, limit]
  );
}
