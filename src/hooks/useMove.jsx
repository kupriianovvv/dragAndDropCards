import { useEffect, useRef } from "react";

export const useMove = (id) => {
  const isClicked = useRef(false);

  const coords = useRef({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  useEffect(() => {
    const card = document.getElementById(id);
    const whiteboard = card.parentElement;

    const onMouseDown = (e) => {
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    };

    const onMouseUp = (e) => {
      isClicked.current = false;
      coords.current.endX = card.offsetLeft;
      coords.current.endY = card.offsetTop;
    };

    const onMouseMove = (e) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX + coords.current.endX;
      const nextY = e.clientY - coords.current.startY + coords.current.endY;

      card.style.top = `${nextY}px`;
      card.style.left = `${nextX}px`;
    };

    card.addEventListener("mousedown", onMouseDown);
    card.addEventListener("mouseup", onMouseUp);
    whiteboard.addEventListener("mousemove", onMouseMove);
    whiteboard.addEventListener("mouseleave", onMouseUp);
  }, [id]);
};
