import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * Este é o layout principal (Shell) do aplicativo.
 * Ele renderiza o Header, o Footer e o "miolo" da página (o Outlet).
 */
export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background">
      <Header />
      {/* O <Outlet> é onde o react-router vai renderizar a página atual (Home, Login, etc.) */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}