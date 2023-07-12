import { useEffect, useState } from "react";
import { rafThrottle } from "../utils/throttle";

export type ICanvasPosition = {
  x: number;
  y: number;
  scale: number;
};

export const useCanvasPosition = (initialCanvasPosition: ICanvasPosition) => {
  const [canvasPosition, setCanvasPosition] = useState<ICanvasPosition>(
    initialCanvasPosition
  );

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
        return {
          x: prevCanvasPosition.x - 0.5 * e.deltaY,
          y: prevCanvasPosition.y,
          scale: prevCanvasPosition.scale,
        };
      }

      function getNewCanvasPositionFromPrevWhenScroll(
        prevCanvasPosition: ICanvasPosition
      ): ICanvasPosition {
        return {
          x: prevCanvasPosition.x,
          y: prevCanvasPosition.y - 0.5 * e.deltaY,
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
    console.log("effect");
    let oldPanCoords: any;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.closest(".card")) return;
      if (e.target instanceof HTMLButtonElement) return;
      oldPanCoords = { x: e.clientX, y: e.clientY };
      console.log("mousedown");

      const onMouseMove = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const newPanCoords = { x: e.clientX, y: e.clientY };
        const oldCoords = { ...oldPanCoords };
        setCanvasPosition((prevCanvasPosition) => {
          return {
            ...prevCanvasPosition,
            x: prevCanvasPosition.x + newPanCoords.x - oldCoords.x,
            y: prevCanvasPosition.y + newPanCoords.y - oldCoords.y,
          };
        });
        oldPanCoords = newPanCoords;
      };
      const onMouseUp = (e: MouseEvent) => {
        if (e.button !== 0) return;
        document.removeEventListener("mousemove", onMouseMove);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp, { once: true });
    };

    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  const moveCanvasPositionToZero = () => {
    setCanvasPosition((prevCanvasPosition) => ({
      x: 0,
      y: 0,
      scale: 1,
    }));
  };

  return { moveCanvasPositionToZero, canvasPosition };
};
