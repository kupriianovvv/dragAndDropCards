import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";

export const Card = memo(
  ({ id, coords, onChangeCoords, onRemoveCard, zoom }) => {
    const [tempCoords, setTempCoords] = useState(null);

    const cardRef = useRef();
    const latestZoom = useRef(zoom);
    const latestTempCoords = useRef(tempCoords);

    useLayoutEffect(() => {
      latestZoom.current = zoom;
    }, [zoom]);

    useLayoutEffect(() => {
      latestTempCoords.current = tempCoords;
    }, [tempCoords]);

    const actualCoords = tempCoords ?? coords;

    useEffect(() => {
      const card = cardRef.current;

      const onMouseDown = (e) => {
        if (!card) {
          return;
        }
        const rect = card.getBoundingClientRect();
        const shift = {
          x: e.clientX - rect.x,
          y: e.clientY - rect.y,
        };
        const onMouseMove = (e) => {
          setTempCoords({
            x:
              (e.clientX - shift.x) / latestZoom.current.scale -
              latestZoom.current.x / latestZoom.current.scale,
            y:
              (e.clientY - shift.y) / latestZoom.current.scale -
              latestZoom.current.y / latestZoom.current.scale,
          });
        };
        const onMouseUp = (e) => {
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
        <section className="card--remove-button" onClick={onRemoveCard}>
          <button>[&times;]</button>
        </section>
        <section className="card--body">text</section>
      </article>
    );
  }
);
