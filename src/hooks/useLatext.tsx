import { useLayoutEffect, useRef } from "react";

export const useLatest = (latestValue) => {
  const latestValueRef = useRef();
  useLayoutEffect(() => {
    latestValueRef.current = latestValue;
  }, [latestValue]);
  return latestValueRef;
};
