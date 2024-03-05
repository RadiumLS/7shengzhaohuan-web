import { RpcRequest, RpcResponse } from "@gi-tcg/core";
import { useCallback, useState } from "react";

interface WaitNotify<T> {
  waiting: boolean;
  wait: () => Promise<T>;
  notify: (value: T) => void;
}

export function useWaitNotify<M extends keyof RpcRequest>(): WaitNotify<RpcResponse[M]> {
  const [waiting, setWaiting] = useState(false);
  let resolve: (value: RpcResponse[M]) => void = () => {};
  const wait = useCallback(() => {
    setWaiting(true);
    return new Promise<RpcResponse[M]>((r) => {
      resolve = r;
    });
  }, []);
  const notify = useCallback((value: RpcResponse[M]) => {
    setWaiting(false);
    return resolve(value);
  }, []);

  return {waiting, wait, notify};
}
export type RpcWaitNotify = {
  [key in keyof RpcRequest]: WaitNotify<RpcResponse[key]>;
};
export function useRpcWaitNotify(): RpcWaitNotify {
  return {
    switchHands: useWaitNotify<'switchHands'>(),
    chooseActive: useWaitNotify<'chooseActive'>(),
    rerollDice: useWaitNotify<'rerollDice'>(),
    action: useWaitNotify<'action'>(),
  };
}