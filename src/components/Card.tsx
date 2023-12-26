import { memo, useEffect, useRef, useState } from "react";
import { ICanvasPosition } from "../hooks/useCanvasPosition";
import { useLatest } from "../hooks/useLatest";
import { ICard, ICoords } from "../hooks/useWhiteboard";

type CardProps = {
  id: number;
  coords: ICoords;
  onChangeCoords: (ChangedCard: Pick<ICard, "id" | "coords">) => void;
  onRemoveCard: (id: number) => void;
  canvasPosition: ICanvasPosition;
  onChangeText: (id: number, newText: string) => void;
  text: string;
};

export const Card = memo(
  ({
    id,
    coords,
    onChangeCoords,
    onRemoveCard,
    canvasPosition,
    onChangeText,
    text,
  }: CardProps) => {
    const [tempCoords, setTempCoords] = useState<ICoords | null>(coords);

    const cardRef = useRef<HTMLElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const latestcanvasPosition = useLatest(canvasPosition);
    const latestTempCoords = useLatest(tempCoords);

    const actualCoords = tempCoords ?? coords;

    useEffect(() => {
      const card = cardRef.current;
      if (!card) {
        return;
      }

      const onMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;
        const rect = card.getBoundingClientRect();
        const shift: ICoords = {
          x: e.clientX - rect.x,
          y: e.clientY - rect.y,
        };
        const onMouseMove = (e: MouseEvent) => {
          e.preventDefault();
          if (e.button !== 0) return;
          setTempCoords({
            x:
              (e.clientX - shift.x) / latestcanvasPosition.current.scale -
              latestcanvasPosition.current.x /
                latestcanvasPosition.current.scale,
            y:
              (e.clientY - shift.y) / latestcanvasPosition.current.scale -
              latestcanvasPosition.current.y /
                latestcanvasPosition.current.scale,
          });
        };
        const onMouseUp = (e: MouseEvent) => {
          if (e.button !== 0) return;
          document.removeEventListener("mousemove", onMouseMove);
          if (latestTempCoords.current !== null) {
            onChangeCoords({ id, coords: latestTempCoords.current });
          }
          setTempCoords(null);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp, { once: true });
      };
      card.addEventListener("mousedown", onMouseDown);
      return () => {
        document.removeEventListener("mousedown", onMouseDown);
      };
    }, [id]);

    const onDblclick = (e: React.MouseEvent) => {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }
      textarea.readOnly = false;
      textarea.focus();
    };

    const onBlur = (e: React.FocusEvent) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }
      textarea.readOnly = true;
      onChangeText(id, textarea.value);
    };

    const onMouseDown = (e: React.MouseEvent) => {
      if (e.detail > 1) {
        e.preventDefault();
        // of course, you still do not know what you prevent here...
        // You could also check event.ctrlKey/event.shiftKey/event.altKey
        // to not prevent something useful.
      }
    };

    return (
      <article
        id={`${id}`}
        className="card"
        style={{
          transform: `translate(${actualCoords.x}px, ${actualCoords.y}px)`,
        }}
        onDoubleClick={onDblclick}
        ref={cardRef}
      >
        <section className="card--remove-button">
          <button onClick={() => onRemoveCard(id)}>[&times;]</button>
        </section>
        <section
          className="card--body"
          style={{ boxSizing: "border-box", height: "100%" }}
        >
          <textarea
            style={{
              width: "80%",
              height: "80%",
              border: "none",
              display: "block",
              margin: "10px auto",
              resize: "none",
            }}
            readOnly
            ref={textareaRef}
            onBlur={onBlur}
            defaultValue={text}
            onMouseDown={onMouseDown}
          ></textarea>
        </section>
      </article>
    );
  }
);
