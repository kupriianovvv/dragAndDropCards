import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLatest } from "../hooks/useLatext";

export const Card = memo(
  ({ id, coords, onChangeCoords, onRemoveCard, canvasPosition }) => {
    const [tempCoords, setTempCoords] = useState(coords);

    const cardRef = useRef();

    const latestcanvasPosition = useLatest(canvasPosition);
    const latestTempCoords = useLatest(tempCoords);

    const actualCoords = tempCoords ?? coords;

    useEffect(() => {
      const card = cardRef.current;

      const onMouseDown = (e) => {
        if (e.button !== 0) return;
        if (!card) {
          return;
        }
        const rect = card.getBoundingClientRect();
        const shift = {
          x: e.clientX - rect.x,
          y: e.clientY - rect.y,
        };
        const onMouseMove = (e) => {
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
        const onMouseUp = (e) => {
          if (e.button !== 0) return;
          document.removeEventListener("mousemove", onMouseMove);
          onChangeCoords(+card.id, latestTempCoords.current);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp, { once: true });
      };

      card.addEventListener("mousedown", onMouseDown);
    }, []);

    return (
      <article
        id={id}
        className="card"
        style={{
          transform: `translate(${actualCoords.x}px, ${actualCoords.y}px)`,
        }}
        ref={cardRef}
      >
        <section className="card--remove-button">
          <button onClick={() => onRemoveCard(id)}>[&times;]</button>
        </section>
        <section className="card--body">text</section>
      </article>
    );
  }
);
