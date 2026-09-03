import React, { useState } from "react";
import {
  Menu, Home as HomeIcon, GraduationCap, Info, Compass,
} from "lucide-react";

export default function Nav({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const items = [
    { id: "home",     gur: "Home",                  en: "Home",                       icon: HomeIcon },
    { id: "mauj",     gur: "MAUJ",                en: "My Att Uttam Journey",       icon: Compass },
    { id: "academic", gur: "ਵਿਦਿਅਕ ਪ੍ਰਫੁੱਲਤਾ",     en: "Academic Excellence @2049",  icon: GraduationCap },
    { id: "about",    gur: "About",                en: "About & Roadmap",            icon: Info },
  ];
  return (
    <header className="au-nav">
      <div className="au-nav-inner">
        <button className="au-brand" onClick={() => { setPage("home"); setOpen(false); }}>
          <span className="au-brand-text au-gur">ਅਤਿ ਊਤਮ ਹੋਵਹੁ</span>
        </button>
        <nav className="au-nav-links">
          {items.map(it => (
            <button
              key={it.id}
              className={"au-nav-link" + (page === it.id ? " au-nav-link-active" : "")}
              onClick={() => setPage(it.id)}
            >
              <span className="au-gur">{it.gur}</span>
            </button>
          ))}
        </nav>
        <button className="au-nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="au-nav-mobile">
          {items.map(it => (
            <button
              key={it.id}
              className="au-nav-mobile-link"
              onClick={() => { setPage(it.id); setOpen(false); }}
            >
              <it.icon size={16} />
              <span className="au-gur">{it.gur}</span>
              <span className="au-nav-mobile-en">{it.en}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
