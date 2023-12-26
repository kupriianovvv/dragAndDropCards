import { createRoot } from "react-dom/client";
import { Card } from "./components/Card";
import { Whiteboard } from "./components/Whiteboard";

const App = () => {
  return (
    <main>
      <Whiteboard />
    </main>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
