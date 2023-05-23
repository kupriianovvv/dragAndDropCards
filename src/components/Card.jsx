export const Card = ({ coords, onChangeCoords, onRemoveCard }) => {
  return (
    <article className="card" style={{ left: coords.x, top: coords.y }}>
      <section className="card--remove-button" onClick={onRemoveCard}>
        [&times;]
      </section>
      <section className="card--body">text</section>
    </article>
  );
};
