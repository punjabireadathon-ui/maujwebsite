import React from "react";
import { ArrowRight } from "lucide-react";
import SectionEyebrow from "../components/SectionEyebrow.jsx";
import Rule from "../components/Rule.jsx";
import Reveal from "../components/Reveal.jsx";
import { toGurmukhi } from "../utils.js";
import academicBanner from "../assets/academic-banner.jpg";

export default function Academic({ setPage }) {
  const cards = [
    { gur: "ਉੱਚ ਇਰਾਦੇ ਸਾਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਂਦੇ ਹਨ", en: "High ideals make us powerful." },
    { gur: "ਵੱਡੇ ਨਿਸ਼ਾਨਿਆਂ ਨਾਲ ਹੌਂਸਲੇ ਵੀ ਵੱਡੇ ਹੋ ਜਾਂਦੇ ਹਨ", en: "Big goals grow big courage." },
    { gur: "ਵੰਗਾਰ! ਅੱਜ ਤੱਕ ਕਿਸੇ ਗੁਰਸਿੱਖ ਨੂੰ ਨੋਬਲ ਪ੍ਰਾਈਜ਼ ਨਹੀਂ ਮਿਲਿਆ", en: "A challenge: no Gursikh has won a Nobel Prize yet." },
    { gur: "ਕੰਮ ਵਿੱਚ ਹੀ ਆਨੰਦ ਹੈ", en: "Work is more fun than fun." },
    { gur: "ਪੜ੍ਹਾਉਣ ਵਾਲੇ ਨੂੰ ਕਦੇ ਵੀ ਸਿੱਖਣਾ ਨਹੀਂ ਛੱਡਣਾ ਚਾਹੀਦਾ", en: "One who teaches should never stop learning." },
    { gur: "ਵਿਦਿਆ ਰਾਹੀਂ ਮਨੁੱਖ ਔਖਿਆਈ ਤੋਂ ਮਸ਼ਾਲ ਬਣ ਜਾਂਦਾ ਹੈ", en: "Through education, hardship is turned into a torch." },
  ];
  return (
    <div>
      <Reveal>
        <section className="au-banner">
          <img
            src={academicBanner}
            alt="ਖਾਲਸਾ ਜੀ ਦੀ ਵਿਦਿਅਕ ਪ੍ਰਫੁੱਲਤਾ · Academic Excellence of Khalsa @2049"
          />
        </section>
      </Reveal>

      <section className="au-page-head">
        <SectionEyebrow>@੨੦੪੯</SectionEyebrow>
        <p className="au-lead">Excellence in academic life, in any discipline, stream, or specialisation.</p>
      </section>

      <section className="au-timeline">
        <div className="au-timeline-point">
          <div className="au-timeline-year au-mono">੧੮੪੯</div>
          <p>Punjab was annexed by the British. The first act was the deliberate dismantling of the Khalsa Raj's education system.</p>
        </div>
        <div className="au-timeline-line" />
        <div className="au-timeline-point">
          <div className="au-timeline-year au-mono">੨੦੪੯</div>
          <p>200 years since. The challenge: reach that lost glory of academic excellence again, by this time.</p>
        </div>
      </section>

      <Rule />

      <section className="au-vision">
        <h2 className="au-gur">ਪੰਥ ਖਾਲਸਾ</h2>
        <ul>
          <li><span className="au-gur">ਪ੍ਰਬੁੱਧ ਹੋਵੇ</span> — the Panth Khalsa becomes enlightened, awakened.</li>
          <li><span className="au-gur">ਹਰ ਗੁਰਸਿੱਖ ਮਾਈ-ਭਾਈ ਵਿਦਿਅਕ ਮਾਹਿਰ ਹੋਵੇ, ਗੁਰਮੁਖ ਵਿਦਵਾਨ ਹੋਵੇ</span> — every Gursikh mother and brother becomes an education specialist, a Gurmukh scholar.</li>
          <li><span className="au-gur">ਪਾਧਾ, ਬੀਨਾ, ਪ੍ਰਬੀਨ ਬਣੀਏ</span> — become learned, discerning, and skilled.</li>
          <li><span className="au-gur">ਖਾਲਸਾ — ਵਿਦਵਾਨ ਹੋਵੇ, ਸਕਾਲਰ ਹੋਵੇ</span> — Sardars of the academic field too.</li>
        </ul>
        <p className="au-vision-note">ਗੁਰੂ ਕੇ ਲਾਲ ਜੀਓ — strive hard enough, search deep enough, that the good of all humanity comes of it, and be honoured with recognitions like the Nobel Prize and the World Food Prize.</p>
      </section>

      <Rule />

      <section className="au-five-s">
        <h2 className="au-gur">ਵਿਦਿਅਕ ਪ੍ਰਫੁੱਲਤਾ ਦੇ ੫ 'ਸ'</h2>
        <div className="au-five-s-grid">
          {["ਸਹਿਜ ਪਾਠ · Sehaj Paath","ਸੈਲਫ ਸਟੱਡੀ · Self Study","ਸਕਿਲਸ · Skills","ਸਕਾਲਰਸ਼ਿਪ · Scholarship","ਸ਼ੇਅਰਿੰਗ · Sharing"].map((s, i) => (
            <div className="au-five-s-item" key={i}>
              <span className="au-mono">{toGurmukhi(i + 1)}</span>
              <span className="au-gur">{s}</span>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      <section className="au-motivate-grid">
        {cards.map((c, i) => (
          <Reveal key={i} delay={(i % 3) * 100}>
            <div className="au-motivate-card">
              <p className="au-gur">{c.gur}</p>
              <p className="au-motivate-en">{c.en}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <Reveal>
        <section className="au-cta-band">
          <p>Who can join? Anyone who wishes to excel in life — no age bar.</p>
          <button className="au-btn-primary" onClick={() => setPage("mauj")}>Start with MAUJ 1 <ArrowRight size={16} /></button>
        </section>
      </Reveal>
    </div>
  );
}
