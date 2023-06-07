import { useCallback, useEffect, useMemo, useState } from "react";
import { useCanvasPosition } from "../hooks/useCanvasPosition";
import { useWhiteboard } from "../hooks/UseWhiteboard";
import { Card } from "./Card";

export const Whiteboard = () => {
  const {
    cards,
    onAddCard,
    onRemoveCard: _onRemoveCard,
    onChangeCoords,
  } = useWhiteboard();

  const [zoom, setZoom] = useState({ x: 0, y: 0, scale: 1 });

  const onRemoveCard = useCallback(_onRemoveCard, []);
  useCanvasPosition(setZoom);

  return (
    <>
      <section>
        <button className="add-button" onClick={onAddCard}>
          Add card
        </button>
      </section>
      <main
        className="whiteboard"
        style={{
          transform: `translate(${zoom.x}px,${zoom.y}px) scale(${zoom.scale},${zoom.scale})`,
        }}
      >
        <section>
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              onRemoveCard={onRemoveCard}
              onChangeCoords={onChangeCoords}
              coords={card.coords}
              zoom={zoom}
            />
          ))}
        </section>
      </main>
    </>
  );
};
