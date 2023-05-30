import { useCallback, useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) return;

      e.preventDefault();

      const getNewZoomFromPrev = (prevZoom) => {
        const normedCoords = {
          x: (e.clientX - prevZoom.x) / prevZoom.scale,
          y: (e.clientY - prevZoom.y) / prevZoom.scale,
        };

        const newScale =
          e.wheelDelta > 0 ? prevZoom.scale * 1.1 : prevZoom.scale / 1.1;
        const newCoords = {
          x: e.clientX - normedCoords.x * newScale,
          y: e.clientY - normedCoords.y * newScale,
        };
        return {
          x: newCoords.x,
          y: e.shiftKey ? prevZoom.y : newCoords.y,
          scale: e.shiftKey ? prevZoom.scale : newScale,
        };
      };

      setZoom(getNewZoomFromPrev);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  //useZoom();
  return (
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
      <section>
        <button className="add-button" onClick={onAddCard}>
          Add card
        </button>
      </section>
    </main>
  );
};
