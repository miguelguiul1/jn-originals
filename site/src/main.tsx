import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { loadCatalog } from "./lib/catalog";

if (/^\/(loja|produto)/.test(location.pathname)) {
  loadCatalog().catch(() => {});
}

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Só a rota "/" vem pré-renderizada; nas outras, descarta o HTML e monta do zero.
if (root.hasChildNodes() && location.pathname === "/") {
  hydrateRoot(root, app);
} else {
  root.textContent = "";
  createRoot(root).render(app);
}
