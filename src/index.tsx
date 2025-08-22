import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/global.css";
import { HashRouter } from "react-router-dom"; // Usando HashRouter

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter> {/* Usando apenas o HashRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>
);
