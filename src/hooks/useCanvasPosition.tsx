import { useCallback, useEffect, useRef, useState } from "react";
import { rafThrottle } from "../utils/throttle";
import { ICoords } from "./useWhiteboard";

export type ICanvasPosition = {
  x: number;
  y: number;
  scale: number;
};

// TODO
const MIN_SCALE = 0.25;
const MAX_SCALE = 5;
const SCALE_STEP = 1.1;

export const useCanvasPosition = (initialCanvasPosition: ICanvasPosition) => {
  const [canvasPosition, setCanvasPosition] = useState<ICanvasPosition>(
    initialCanvasPosition
  );
  const backgroundRef = useRef<HTMLElement | null>(null);
  const oldPanCoorsRef = useRef<ICoords>({ x: 0, y: 0 });

  const backgroundRefCb = useCallback((element: HTMLElement | null) => {
    backgroundRef.current = element;
  }, []);

  useEffect(() => {
    const createGetNewCanvasPositionFromPrev = (e: WheelEvent) => {
      function getNewCanvasPositionFromPrevWhenScrollAndCTRLOrCommand(
        prevCanvasPosition: ICanvasPosition
      ): ICanvasPosition {
        const normedCoords = {
          x: (e.clientX - prevCanvasPosition.x) / prevCanvasPosition.scale,
          y: (e.clientY - prevCanvasPosition.y) / prevCanvasPosition.scale,
        };

        const newScale =
          e.deltaY < 0
            ? prevCanvasPosition.scale * 1.1
            : prevCanvasPosition.scale / 1.1;
        const newCoords = {
          x: e.clientX - normedCoords.x * newScale,
          y: e.clientY - normedCoords.y * newScale,
        };
        return {
          x: newCoords.x,
          y: newCoords.y,
          scale: newScale,
        };
      }
      function getNewCanvasPositionFromPrevWhenScrollAndShift(
        prevCanvasPosition: ICanvasPosition
      ): ICanvasPosition {
        //MacOs fix
        const delta =
          Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        return {
          x: prevCanvasPosition.x - 0.5 * delta,
          y: prevCanvasPosition.y,
          scale: prevCanvasPosition.scale,
        };
      }

      function getNewCanvasPositionFromPrevWhenScroll(
        prevCanvasPosition: ICanvasPosition
      ): ICanvasPosition {
        const [deltaX, deltaY] =
          Math.abs(e.deltaX) > Math.abs(e.deltaY)
            ? [e.deltaX, 0]
            : [0, e.deltaY];

        return {
          x: prevCanvasPosition.x - 0.5 * deltaX,
          y: prevCanvasPosition.y - 0.5 * deltaY,
          scale: prevCanvasPosition.scale,
        };
      }

      if (e.ctrlKey || e.metaKey)
        return getNewCanvasPositionFromPrevWhenScrollAndCTRLOrCommand;
      if (e.shiftKey) return getNewCanvasPositionFromPrevWhenScrollAndShift;
      return getNewCanvasPositionFromPrevWhenScroll;
    };

    const updateCanvasPosition = rafThrottle((latestArg) => {
      const getNewCanvasPositionFromPrev =
        createGetNewCanvasPositionFromPrev(latestArg);
      setCanvasPosition(getNewCanvasPositionFromPrev);
    });

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      updateCanvasPosition(e);
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      updateCanvasPosition.cancel();
    };
  }, []);

  useEffect(() => {
    const background = backgroundRef.current;

    if (!background) {
      return;
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      oldPanCoorsRef.current = { x: e.clientX, y: e.clientY };

      const onMouseMove = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const newPanCoords: ICoords = { x: e.clientX, y: e.clientY };
        const oldPanCoords = oldPanCoorsRef.current;
        const deltaX = newPanCoords.x - oldPanCoords.x;
        const deltaY = newPanCoords.y - oldPanCoords.y;
        setCanvasPosition((prevCanvasPosition) => {
          return {
            ...prevCanvasPosition,
            x: prevCanvasPosition.x + deltaX,
            y: prevCanvasPosition.y + deltaY,
          };
        });
        oldPanCoorsRef.current = newPanCoords;
      };
      const onMouseUp = (e: MouseEvent) => {
        if (e.button !== 0) return;
        background.removeEventListener("mousemove", onMouseMove);
      };

      background.addEventListener("mousemove", onMouseMove);
      background.addEventListener("mouseup", onMouseUp, { once: true });
    };

    background.addEventListener("mousedown", onMouseDown);

    return () => {
      background.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  const moveCanvasPositionToZero = () => {
    setCanvasPosition(() => ({
      x: 0,
      y: 0,
      scale: 1,
    }));
  };

  return {
    moveCanvasPositionToZero,
    backgroundRef: backgroundRefCb,
    canvasPosition,
  };
};
