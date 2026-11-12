import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { CartProvider } from "./lib/cart";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { Intro } from "./components/Intro";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";

const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const HowToBuy = lazy(() => import("./pages/HowToBuy"));
const Store = lazy(() => import("./pages/Store"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

export default function App({ Router = BrowserRouter }: { Router?: (p: { children: ReactNode }) => ReactNode } = {}) {
  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <Intro />
        <div id="shell">
          <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-amarelo focus:p-3 focus:text-tinta">Pular para o conteúdo</a>
          <Header />
          <main id="conteudo" tabIndex={-1} className="min-h-screen outline-none">
            <Suspense fallback={<div className="wrap py-8" style={{ minHeight: "100vh" }}><div className="skeleton h-64" /></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/loja" element={<Catalog />} />
                <Route path="/produto/:slug" element={<Product />} />
                <Route path="/sacola" element={<Cart />} />
                <Route path="/finalizar" element={<Checkout />} />
                <Route path="/como-comprar" element={<HowToBuy />} />
                <Route path="/a-loja" element={<Store />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
        <CartDrawer />
      </CartProvider>
    </Router>
  );
}
