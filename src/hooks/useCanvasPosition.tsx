import { useEffect, useState } from "react";
import { rafThrottle } from "../utils/throttle";
import { ICoords } from "./useWhiteboard";

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
        //MacOs fix
        const delta = e.deltaY === 0 ? e.deltaX : e.deltaY;
        return {
          x: prevCanvasPosition.x - 0.5 * delta,
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
    console.log("asds");
    const background = document.getElementById("background");
    let oldPanCoords: ICoords;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.closest(".card")) return;
      if (e.target instanceof HTMLButtonElement) return;
      oldPanCoords = { x: e.clientX, y: e.clientY };

      const onMouseMove = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const newPanCoords: ICoords = { x: e.clientX, y: e.clientY };
        const deltaX = newPanCoords.x - oldPanCoords.x;
        const deltaY = newPanCoords.y - oldPanCoords.y;
        setCanvasPosition((prevCanvasPosition) => {
          return {
            ...prevCanvasPosition,
            x: prevCanvasPosition.x + deltaX,
            y: prevCanvasPosition.y + deltaY,
          };
        });
        oldPanCoords = newPanCoords;
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
    setCanvasPosition((prevCanvasPosition) => ({
      x: 0,
      y: 0,
      scale: 1,
    }));
  };

  return { moveCanvasPositionToZero, canvasPosition };
};
