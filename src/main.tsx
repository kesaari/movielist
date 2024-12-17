import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {GenreProvider} from "./comp/GenreContext.tsx";

createRoot(document.getElementById("root")!).render(
  <GenreProvider>
    <App />
  </GenreProvider>
);
