import { useCallback, useState } from "react";
import { getId } from "../utils/getId";

export const useWhiteboard = (
  initialCards = [
    { id: -1, coords: { x: 100, y: 0 } },
    { id: 0, coords: { x: 200, y: 300 } },
  ]
) => {
  const [cards, setCards] = useState(initialCards);

  const onAddCard = useCallback(() => {
    setCards((prevCards) => [
      ...prevCards,
      { id: getId(), coords: { x: 500, y: 0 } },
    ]);
  }, []);

  const onRemoveCard = useCallback((id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  }, []);

  const onChangeCoords = useCallback(
    (id: number, coords: { x: number; y: number }) => {
      setCards((prevCards) => {
        return prevCards.map((card) => {
          if (card.id !== id) return card;
          return {
            ...card,
            coords: {
              ...card.coords,
              x: coords.x,
              y: coords.y,
            },
          };
        });
      });
    },
    []
  );

  return { cards, onAddCard, onRemoveCard, onChangeCoords };
};
