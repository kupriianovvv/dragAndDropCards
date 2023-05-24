import { useWhiteboard } from "../hooks/UseWhiteboard";
import { Card } from "./Card";

export const Whiteboard = () => {
  const { cards, onAddCard, onRemoveCard, onChangeCoords } = useWhiteboard();
  return (
    <main className="whiteboard">
      <section>
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            onRemoveCard={() => onRemoveCard(card.id)}
            onChangeCoords={onChangeCoords}
            coords={card.coords}
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
