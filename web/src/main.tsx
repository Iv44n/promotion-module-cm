/** biome-ignore-all lint/style/noNonNullAssertion: <> */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
