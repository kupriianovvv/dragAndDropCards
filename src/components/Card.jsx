import { useMove } from "../hooks/useMove";

export const Card = ({ id, children }) => {
  useMove(id);

  return (
    <div id={id} className="card">
      {children}
    </div>
  );
};
