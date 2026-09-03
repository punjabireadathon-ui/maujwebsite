import React, { useState } from "react";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Academic from "./pages/Academic.jsx";
import About from "./pages/About.jsx";
import MaujSection from "./pages/mauj/MaujSection.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <AuthProvider>
      <div className="au-root">
        <Nav page={page} setPage={setPage} />
        {page === "home"     && <Home     setPage={setPage} />}
        {page === "mauj"     && <MaujSection />}
        {page === "academic" && <Academic setPage={setPage} />}
        {page === "about"    && <About    setPage={setPage} />}

        <footer className="au-footer">
          <p className="au-gur">ਅਤਿ ਊਤਮ ਹੋਵਹੁ</p>
          <p>Spiritual, Academic and Professional Excellence</p>
        </footer>
      </div>
    </AuthProvider>
  );
}
