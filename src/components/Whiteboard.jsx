import { useEffect, useState } from "react";
import { useWhiteboard } from "../hooks/UseWhiteboard";
import { Card } from "./Card";

export const Whiteboard = () => {
  const { cards, onAddCard, onRemoveCard, onChangeCoords } = useWhiteboard();

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();

      const normedCoords = {
        x: (e.clientX - coords.x) / scale,
        y: (e.clientY - coords.y) / scale,
      };

      const newScale = e.wheelDelta > 0 ? scale * 1.1 : scale / 1.1;
      const newCoords = {
        x: e.clientX - normedCoords.x * newScale,
        y: e.clientY - normedCoords.y * newScale,
      };

      setScale(newScale);
      setCoords(newCoords);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [coords.x, coords.y, scale]);

  //useZoom();
  return (
    <main
      className="whiteboard"
      style={{
        transform: `translate(${coords.x}px,${coords.y}px) scale(${scale},${scale})`,
      }}
    >
      <section>
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            onRemoveCard={() => onRemoveCard(card.id)}
            onChangeCoords={onChangeCoords}
            coords={card.coords}
          />
        ))}
      </section>
      <section>
        <button className="add-button" onClick={onAddCard}>
          Add card
        </button>
      </section>
    </main>
  );
};
