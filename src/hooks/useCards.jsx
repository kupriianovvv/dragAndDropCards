import { useState } from "react";
// TODO: replace with uuid
let id = 1;

export const useCards = (card = []) => {
  const [cards, setCards] = useState(card);

  const onAddCard = () => {
    setCards((prevCards) => [...prevCards, { id: id++, text: "" }]);
  };

  return [cards, onAddCard];
};
