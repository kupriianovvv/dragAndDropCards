import { useCards } from "../hooks/useCards";
import { Card } from "./Card";

export const Whiteboard = () => {
  const [cards, onAddCard] = useCards([{ id: 0, text: "textextext" }]);

  return (
    <div className="whiteboard">
      <section>
        <button onClick={onAddCard}>Add card</button>
      </section>
      <section>
        {cards.map((card) => (
          <Card key={card.id} id={card.id}>
            {card.text}
          </Card>
        ))}
      </section>
    </div>
  );
};
