import React from "react";
import {
  ChevronRight, ArrowRight, Compass, GraduationCap, Info,
  Sparkles, Clock, Target,
} from "lucide-react";
import SectionEyebrow from "../components/SectionEyebrow.jsx";
import Rule from "../components/Rule.jsx";
import Reveal from "../components/Reveal.jsx";
import AuroraBg from "../components/AuroraBg.jsx";

export default function Home({ setPage }) {
  return (
    <div>
      <section className="au-hero">
        <AuroraBg />

        <SectionEyebrow>ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ</SectionEyebrow>
        <h1 className="au-hero-shabad au-gur">
          ਅਤਿ ਊਤਮ ਅਤਿ ਊਤਮ ਹੋਵਹੁ<br />ਸਭ ਸ੍ਰਿਸਟਿ ਚਰਨ ਤਲ ਦੀਜੈ ॥੨॥
        </h1>
        <p className="au-hero-gloss">
          You shall be utterly exalted, the most noble and sublime of all; the whole world will place itself at your feet. ||2||
        </p>

        <div className="au-hero-actions">
          <button className="au-btn-primary" onClick={() => setPage("mauj")}>
            Start your MAUJ Journey<ArrowRight size={16} />
          </button>
        </div>

        <div className="au-hero-stats">
          <div className="au-stat"><span>੮</span><small>Atomic Habits</small></div>
          <div className="au-stat-sep" />
          <div className="au-stat"><span>੩੦</span><small>Min / Day</small></div>
          <div className="au-stat-sep" />
          <div className="au-stat"><span>੨੦੪੯</span><small>Vision Year</small></div>
        </div>

        <div className="au-hero-scroll" aria-hidden="true"><span /></div>
      </section>

      <Rule />

      <section className="au-pillars">
        {[
          {
            id: "mauj", Icon: Compass, title: "MAUJ",
            desc: "My Att Uttam Journey — 8 atomic habits, just 30 minutes a day, tracked and saved.",
            link: "ਸ਼ੁਰੂ ਕਰੋ",
          },
          {
            id: "academic", Icon: GraduationCap, title: "ਵਿਦਿਅਕ ਪ੍ਰਫੁੱਲਤਾ",
            desc: "Academic Excellence of Khalsa @2049 — reclaiming 200 years of lost academic glory.",
            link: "ਪੜ੍ਹੋ",
          },
          {
            id: "about", Icon: Info, title: "About",
            desc: "The roadmap beyond MAUJ 1, and the 24 character strengths we're building toward.",
            link: "ਵੇਖੋ",
          },
        ].map((p, i) => (
          <Reveal key={p.id} delay={i * 120}>
            <div className="au-pillar" onClick={() => setPage(p.id)}>
              <p.Icon size={26} />
              <h3 className="au-gur">{p.title}</h3>
              <p>{p.desc}</p>
              <span className="au-pillar-link">{p.link} <ChevronRight size={14} /></span>
            </div>
          </Reveal>
        ))}
      </section>

      <Rule />

      <section className="au-why">
        <Reveal>
          <SectionEyebrow>How it works</SectionEyebrow>
          <h2 className="au-why-title au-gur">Small habits. Long horizon. Real change.</h2>
        </Reveal>
        <div className="au-why-grid">
          {[
            { Icon: Sparkles, title: "Atomic Habits",     desc: "Habits so small they're impossible to skip on a hard day." },
            { Icon: Clock,    title: "੩੦ min/day", desc: "Consistent, humane, and sustainable over months and years." },
            { Icon: Target,   title: "Toward 2049", desc: "Achieving Academic Excellence of Khalsa by year 2049" },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <div className="au-why-card">
                <div className="au-why-icon"><f.Icon size={20} /></div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Rule />

      <Reveal>
        <section className="au-quote-strip">
          <p>ਗੁਰੂ ਬਖਸ਼ਿਸ਼ ਸਦਕਾ<br></br>
            ਮੈਂ ਕੁਝ ਕਰਨਾ ਹੈ, ਮੈਂ ਕੁਝ ਬਣਨਾ ਹੈ
          </p>
        </section>
      </Reveal>
    </div>
  );
}
