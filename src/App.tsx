import { createRoot } from "react-dom/client";
import { Whiteboard } from "./components/Whiteboard";

const App = () => {
  return <Whiteboard />;
};

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);
