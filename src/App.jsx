import { createRoot } from "react-dom/client";
import { Card } from "./components/Card";

const App = () => {
  return (
    <main>
      <div className="whiteboard">
        <Card id={1} />
        <Card id={2} />
        <Card id={3} />
      </div>
    </main>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
