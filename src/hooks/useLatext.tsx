import { useLayoutEffect, useRef } from "react";

export const useLatest = (latestValue: any) => {
  const latestValueRef = useRef<any>();
  useLayoutEffect(() => {
    latestValueRef.current = latestValue;
  }, [latestValue]);
  return latestValueRef;
};
