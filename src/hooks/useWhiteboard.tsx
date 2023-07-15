import { useCallback, useState } from "react";
import { getId } from "../utils/getId";

export type ICoords = {
  x: number;
  y: number;
};

export type ICard = {
  id: number;
  coords: ICoords;
  text: string;
};

// TODO
export type ICards = ICard[];

export const useWhiteboard = (
  initialCards: ICards = [
    { id: -1, coords: { x: 100, y: 0 }, text: "card -1" },
    { id: 0, coords: { x: 200, y: 300 }, text: "card 0" },
  ]
) => {
  const [cards, setCards] = useState<ICards>(initialCards);

  const onAddCard = useCallback(() => {
    setCards((prevCards) => [
      ...prevCards,
      { id: getId(), coords: { x: 500, y: 0 }, text: "" },
    ]);
  }, []);

  const onRemoveCard = useCallback((id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  }, []);

  const onChangeCoords = useCallback((changedCard: ICard) => {
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
  }, []);

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
