import { useCanvasPosition } from "../hooks/useCanvasPosition";
import { useWhiteboard } from "../hooks/useWhiteboard";
import { Card } from "./Card";
import image from "../assets/grid.svg";
import { useEffect } from "react";

export const Whiteboard = () => {
  const { cards, onAddCard, onRemoveCard, onChangeCoords, onChangeText } =
    useWhiteboard();

  const { canvasPosition, moveCanvasPositionToZero } = useCanvasPosition({
    x: 0,
    y: 0,
    scale: 1,
  });

  const inset: `${number}%` = `${(100 - 100 / canvasPosition.scale) / 2}%`;

  // TODO
  useEffect(() => {
    window.addEventListener("click", (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.closest(".card")) {
        return;
      }
      const elem = document.querySelector(
        "textarea:not([readonly])"
      ) as HTMLTextAreaElement | null;
      if (elem === null) return;
      elem.readOnly = true;
    });
  }, []);

  return (
    <>
      <section style={{ position: "fixed", zIndex: 1 }}>
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
      <div style={{ position: "relative" }}>
        <div
          style={{
            transform: `scale(${canvasPosition.scale})`,
            //backgroundPosition: `-${canvasPosition.x}px -${canvasPosition.y}px`,
            backgroundImage: `url(${image})`,
            position: "fixed",
            inset: inset,
            zIndex: -1,
          }}
        ></div>

        <main
          className="whiteboard"
          style={{
            transform: `translate(${canvasPosition.x}px,${canvasPosition.y}px) scale(${canvasPosition.scale})`,
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
                onChangeText={onChangeText}
                text={card.text}
              />
            ))}
          </section>
        </main>
      </div>
    </>
  );
};
