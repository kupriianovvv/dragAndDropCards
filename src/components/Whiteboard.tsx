import { useCanvasPosition } from "../hooks/useCanvasPosition";
import { useWhiteboard } from "../hooks/useWhiteboard";
import { Card } from "./Card";
import image from "../assets/grid.svg";

export const Whiteboard = () => {
  const { cards, onAddCard, onRemoveCard, onChangeCoords, onChangeText } =
    useWhiteboard();

  const { canvasPosition, moveCanvasPositionToZero, backgroundRef } =
    useCanvasPosition({
      x: 0,
      y: 0,
      scale: 1,
    });

  const inset: `${number}%` = `${(100 - 100 / canvasPosition.scale) / 2}%`;

  return (
    <>
      <section style={{ position: "fixed", zIndex: 1 }}>
        <button
          className="add-button"
          onClick={() => onAddCard(canvasPosition)}
        >
          Add card
        </button>
        <button
          className="return-canvas-position-button"
          onClick={moveCanvasPositionToZero}
        >
          scroll back
        </button>
      </section>
      <div style={{ position: "relative" }}>
        <div
          style={{
            transform: `scale(${canvasPosition.scale})`,
            backgroundPosition: `${canvasPosition.x / canvasPosition.scale}px ${
              canvasPosition.y / canvasPosition.scale
            }px`,
            backgroundImage: `url(${image})`,
            position: "fixed",
            inset: inset,
            zIndex: 0,
          }}
          ref={backgroundRef}
          id="background"
        ></div>

        <main
          className="whiteboard"
          style={{
            transform: `translate(${canvasPosition.x}px,${canvasPosition.y}px) scale(${canvasPosition.scale})`,
          }}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              onRemoveCard={onRemoveCard}
              onChangeCoords={onChangeCoords}
              coords={card.coords}
              canvasPosition={canvasPosition}
              onChangeText={onChangeText}
              text={card.text}
            />
          ))}
        </main>
      </div>
    </>
  );
};
