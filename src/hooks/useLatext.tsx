import { useLayoutEffect, useRef } from "react";

export const useLatest = <T,>(latestValue: T) => {
  const latestValueRef = useRef<T>(latestValue);
  useLayoutEffect(() => {
    latestValueRef.current = latestValue;
  }, [latestValue]);
  return latestValueRef;
};
