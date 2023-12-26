import { useCallback, useState } from "react";
import { getId } from "../utils/getId";
import { ICanvasPosition } from "./useCanvasPosition";

export type ICoords = {
  x: number;
  y: number;
};

export type ICard = {
  id: number;
  coords: ICoords;
  text: string;
};

export const useWhiteboard = (
  initialCards: ICard[] = [
    { id: -1, coords: { x: 100, y: 0 }, text: "card -1" },
    { id: 0, coords: { x: 200, y: 300 }, text: "card 0" },
  ]
) => {
  const [cards, setCards] = useState<ICard[]>(initialCards);

  const onAddCard = useCallback((canvasPosition: ICanvasPosition) => {
    //TODO: replace 200 to center card
    setCards((prevCards) => [
      ...prevCards,
      {
        id: getId(),
        coords: {
          x: -canvasPosition.x / canvasPosition.scale + 200,
          y: -canvasPosition.y / canvasPosition.scale + 200,
        },
        text: "",
      },
    ]);
  }, []);

  const onRemoveCard = useCallback((id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  }, []);

  const onChangeCoords = useCallback(
    (changedCard: Pick<ICard, "id" | "coords">) => {
      setCards((prevCards) => {
        return prevCards.map((card) => {
          if (card.id !== changedCard.id) return card;
          return {
            ...card,
            coords: {
              ...card.coords,
              x: changedCard.coords.x,
              y: changedCard.coords.y,
            },
          };
        });
      });
    },
    []
  );

  const onChangeText = useCallback((id: number, newText: string) => {
    setCards((prevCards) => {
      return prevCards.map((card) => {
        if (card.id !== id) return card;
        return {
          ...card,
          coords: { ...card.coords },
          text: newText,
        };
      });
    });
  }, []);

  return { cards, onAddCard, onRemoveCard, onChangeCoords, onChangeText };
};
