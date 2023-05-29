import { useEffect, useLayoutEffect, useRef } from "react";

export const Card = ({ id, coords, onChangeCoords, onRemoveCard, zoom }) => {
  const cardRef = useRef();
  const latestZoom = useRef(zoom);

  useLayoutEffect(() => {
    latestZoom.current = zoom;
  }, [zoom]);

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
        onChangeCoords(+card.id, {
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
      style={{ transform: `translate(${coords.x}px, ${coords.y}px)` }}
      ref={cardRef}
    >
      <section className="card--remove-button" onClick={onRemoveCard}>
        <button>[&times;]</button>
      </section>
      <section className="card--body">text</section>
    </article>
  );
};
