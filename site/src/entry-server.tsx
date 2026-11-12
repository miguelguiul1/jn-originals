import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import type { ReactNode } from "react";
import App from "./App";

export function render(url: string) {
  const Router = ({ children }: { children: ReactNode }) => <StaticRouter location={url}>{children}</StaticRouter>;
  return renderToString(<App Router={Router} />);
}
