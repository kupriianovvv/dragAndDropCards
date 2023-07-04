import { memo, useEffect, useRef, useState } from "react";
import { useLatest } from "../hooks/useLatext";

export const Card = memo(
  ({
    id,
    coords,
    onChangeCoords,
    onRemoveCard,
    canvasPosition,
  }: {
    id: number;
    coords: { x: number; y: number };
    onChangeCoords: any;
    onRemoveCard: any;
    canvasPosition: { x: number; y: number; scale: number };
  }) => {
    const [tempCoords, setTempCoords] = useState<{
      x: number;
      y: number;
    } | null>(coords);
    const [content, setContent] = useState(`card#${id}`);

    const cardRef = useRef<HTMLElement | null>(null);

    const latestcanvasPosition = useLatest(canvasPosition);
    const latestTempCoords = useLatest(tempCoords);

    const actualCoords = tempCoords ?? coords;

    useEffect(() => {
      const card = cardRef.current;

      const onMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;
        if (card === null) {
          return;
        }
        const rect = card.getBoundingClientRect();
        const shift = {
          x: e.clientX - rect.x,
          y: e.clientY - rect.y,
        };
        const onMouseMove = (e: MouseEvent) => {
          if (e.button !== 0) return;
          setTempCoords({
            x:
              (e.clientX - shift.x) / latestcanvasPosition.current.scale -
              latestcanvasPosition.current.x /
                latestcanvasPosition.current.scale,
            y:
              (e.clientY - shift.y) / latestcanvasPosition.current.scale -
              latestcanvasPosition.current.y /
                latestcanvasPosition.current.scale,
          });
        };
        const onMouseUp = (e: MouseEvent) => {
          if (e.button !== 0) return;
          document.removeEventListener("mousemove", onMouseMove);
          if (latestTempCoords.current !== null) {
            onChangeCoords(id, latestTempCoords.current);
          }
          setTempCoords(null);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp, { once: true });
      };

      if (card !== null) {
        card.addEventListener("mousedown", onMouseDown);
      }

      return () => {
        document.removeEventListener("mousedown", onMouseDown);
      };
    }, [id]);

    return (
      <article
        id={`${id}`}
        className="card"
        style={{
          transform: `translate(${actualCoords.x}px, ${actualCoords.y}px)`,
        }}
        ref={cardRef}
      >
        <section className="card--remove-button">
          <button onClick={() => onRemoveCard(id)}>[&times;]</button>
        </section>
        <section
          className="card--body"
          style={{ boxSizing: "border-box", height: "100%" }}
        >
          <textarea
            style={{
              width: "80%",
              height: "80%",
              border: "none",
              display: "block",
              margin: "10px auto",
              resize: "none",
            }}
          >
            {content}
          </textarea>
        </section>
      </article>
    );
  }
);
