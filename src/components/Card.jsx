import { useEffect, useRef } from "react";

export const Card = ({ id, coords, onChangeCoords, onRemoveCard }) => {
  const cardRef = useRef();

  useEffect(() => {
    const el = cardRef.current;
    if (!el) {
      return;
    }

    el.onmousedown = (e) => {
      const rect = el.getBoundingClientRect();
      const shift = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };

      document.onmousemove = (e) => {
        onChangeCoords(+el.id, {
          x: e.clientX - shift.x,
          y: e.clientY - shift.y,
        });
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
      };
    };
  }, []);

  return (
    <article
      id={id}
      className="card"
      style={{ left: coords.x, top: coords.y }}
      ref={cardRef}
    >
      <section className="card--remove-button" onClick={onRemoveCard}>
        [&times;]
      </section>
      <section className="card--body">text</section>
    </article>
  );
};
