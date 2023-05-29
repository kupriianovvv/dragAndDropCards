import { useEffect, useRef } from "react";

export const Card = ({ id, coords, onChangeCoords, onRemoveCard }) => {
  /*   const cardRef = useRef(); */

  const onMouseDown = (e) => {
    const card = e.target;
    const rect = card.getBoundingClientRect();
    const shift = {
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
    };
    document.onmousemove = (e) => {
      onChangeCoords(+card.id, {
        x: (e.clientX - shift.x) / 2 - 50,
        y: (e.clientY - shift.y) / 2 - 150,
      });

      // делим на скейл вычитаем translate деленный на скейл
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
  /*   useEffect(() => {
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
        document.onmouseup = null;
      };
    };
  }, []); */

  return (
    <article
      id={id}
      className="card"
      style={{ transform: `translate(${coords.x}px, ${coords.y}px)` }}
      /* ref={cardRef} */
      onMouseDown={onMouseDown}
    >
      <section className="card--remove-button" onClick={onRemoveCard}>
        <button>[&times;]</button>
      </section>
      <section className="card--body">text</section>
    </article>
  );
};
