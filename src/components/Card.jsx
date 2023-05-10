import { useMove } from "../hooks/useMove";

// MEGATODO: cards appear in different places
// TODO: beautify
export const Card = ({ id, children, onRemoveCard }) => {
  useMove(id);

  return (
    <div id={id} className="card">
      <section>
        <button className="remove-button" onClick={() => onRemoveCard(id)}>
          [x]
        </button>
      </section>
      <section>{children}</section>
    </div>
  );
};
