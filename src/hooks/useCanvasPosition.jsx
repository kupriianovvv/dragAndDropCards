import { useEffect, useState } from "react";

export const useCanvasPosition = (initialCanvasPosition) => {
  const [canvasPosition, setCanvasPosition] = useState(initialCanvasPosition);

  useEffect(() => {
    const getNewCanvasPositionFromPrevWhenScrollAndCTRLOrCommand = (e) => {
      return (prevCanvasPosition) => {
        const normedCoords = {
          x: (e.clientX - prevCanvasPosition.x) / prevCanvasPosition.scale,
          y: (e.clientY - prevCanvasPosition.y) / prevCanvasPosition.scale,
        };

        const newScale =
          e.wheelDelta > 0
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
      };
    };

    const getNewCanvasPositionFromPrevWhenScrollAndShift = (e) => {
      return (prevCanvasPosition) => {
        return {
          x: prevCanvasPosition.x + 0.5 * e.wheelDelta,
          y: prevCanvasPosition.y,
          scale: prevCanvasPosition.scale,
        };
      };
    };

    const getNewCanvasPositionFromPrevWhenScroll = (e) => {
      return (prevCanvasPosition) => {
        return {
          x: prevCanvasPosition.x,
          y: prevCanvasPosition.y + 0.5 * e.wheelDelta,
          scale: prevCanvasPosition.scale,
        };
      };
    };

    const createGetNewCanvasPositionFromPrev = (e) => {
      function getNewCanvasPositionFromPrevWhenScrollAndCTRLOrCommand(
        prevCanvasPosition
      ) {
        const normedCoords = {
          x: (e.clientX - prevCanvasPosition.x) / prevCanvasPosition.scale,
          y: (e.clientY - prevCanvasPosition.y) / prevCanvasPosition.scale,
        };

        const newScale =
          e.wheelDelta > 0
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
        prevCanvasPosition
      ) {
        return {
          x: prevCanvasPosition.x + 0.5 * e.wheelDelta,
          y: prevCanvasPosition.y,
          scale: prevCanvasPosition.scale,
        };
      }

      function getNewCanvasPositionFromPrevWhenScroll(prevCanvasPosition) {
        return {
          x: prevCanvasPosition.x,
          y: prevCanvasPosition.y + 0.5 * e.wheelDelta,
          scale: prevCanvasPosition.scale,
        };
      }

      if (e.ctrlKey || e.metaKey)
        return getNewCanvasPositionFromPrevWhenScrollAndCTRLOrCommand;
      if (e.shiftKey) return getNewCanvasPositionFromPrevWhenScrollAndShift;
      return getNewCanvasPositionFromPrevWhenScroll;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const getNewCanvasPositionFromPrev =
        createGetNewCanvasPositionFromPrev(e);
      requestAnimationFrame(() =>
        setCanvasPosition(getNewCanvasPositionFromPrev)
      );
    };
    window.addEventListener("wheel", onWheel, { passive: false });
  }, []);

  const moveCanvasPositionToZero = () => {
    setCanvasPosition((prevCanvasPosition) => ({
      x: 0,
      y: 0,
      scale: prevCanvasPosition.scale,
    }));
  };

  return { moveCanvasPositionToZero, canvasPosition, setCanvasPosition };
};
