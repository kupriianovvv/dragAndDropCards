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

  const onRemoveCard = useCallback(_onRemoveCard, []);
  const { canvasPosition, setCanvasPosition, moveCanvasPositionToZero } =
    useCanvasPosition({
      x: 0,
      y: 0,
      scale: 1,
    });

  return (
    <>
      <section>
        <button className="add-button" onClick={onAddCard}>
          Add card
        </button>
        <button
          className="return-canvas-position-button"
          onClick={moveCanvasPositionToZero}
        >
          scroll back
        </button>
      </section>
      <main
        className="whiteboard"
        style={{
          transform: `translate(${canvasPosition.x}px,${canvasPosition.y}px) scale(${canvasPosition.scale},${canvasPosition.scale})`,
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
              canvasPosition={canvasPosition}
            />
          ))}
        </section>
      </main>
    </>
  );
};
