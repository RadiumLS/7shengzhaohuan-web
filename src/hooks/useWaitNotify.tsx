import { useCallback, useState } from "react";

export function useWaitNotify<T = unknown>(): [
  waiting: boolean,
  wait: () => Promise<T>,
  notify: (value: T) => void,
] {
  const [waiting, setWaiting] = useState(false);
  let resolve: (value: T) => void = () => {};
  const wait = useCallback(() => {
    setWaiting(true);
    return new Promise<T>((r) => {
      resolve = r;
    });
  }, []);
  const notify = useCallback((value: T) => {
    setWaiting(false);
    return resolve(value);
  }, []);
  return [waiting, wait, notify];
}