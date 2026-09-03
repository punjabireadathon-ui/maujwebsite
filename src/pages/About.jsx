import React from "react";
import { ChevronRight, ArrowRight, Award } from "lucide-react";
import SectionEyebrow from "../components/SectionEyebrow.jsx";
import Rule from "../components/Rule.jsx";
import Seal from "../components/Seal.jsx";
import Reveal from "../components/Reveal.jsx";
import { CHAR_STRENGTHS } from "../constants.js";

export default function About({ setPage }) {
  return (
    <div>
      <section className="au-page-head">
        <SectionEyebrow>Vision &amp; Roadmap</SectionEyebrow>
        <h1 className="au-gur">About MAUJ</h1>
        <p className="au-lead">MAUJ - My Att Uttam Journey
<br></br>A road map to achieve excellence in life.</p>
      </section>

      <section>
        <p className="au-lead" style={{ textAlign: "center" }}>Academic Excellence of Khalsa @2049
<br></br>Excellence in academic in any discipline, stream or specialisation.
Why 2049 ?
Punjab was annexed by Britishers in 1849. The first thing they did was complete destruction of education system of Khalsa Raj.
In 2049, we will be completing 200 years. It is a challenge for all of us to reach up to that Glory of academic excellence again by this time.</p>
      </section>

      <section> 
        <p className="au-lead">
          Who can join ?<br></br>
Anyone who wish to excel in life can join. No age bar.
<br></br><br></br>
What to do daily ?<br></br>
In the first phase everyone will have to do 8 atomic habits as follows

The first phase will last for three to five months. After completing first phase next phases will unfold.  Candidates will have an opportunity to meet the mentors and chart out their own specific career paths.

        </p>
      </section>

      <section className="au-roadmap-strip">
        <Seal label="MAUJ ੧" sub="8 atomic habits" state="open" />
        <div className="au-roadmap-arrow"><ChevronRight size={18} /></div>
        <Seal label="MAUJ ੨" sub="In progress" state="progress" />
        <div className="au-roadmap-arrow"><ChevronRight size={18} /></div>
        <Seal label="Mentorship" sub="Illustrative" state="locked" />
        <div className="au-roadmap-arrow"><ChevronRight size={18} /></div>
        <Seal label="Career Paths" sub="Illustrative" state="locked" />
      </section>
      <p className="au-roadmap-note">Phases beyond MAUJ 1 are still unfolding — this order is illustrative, not final.</p>

      <Rule />

      <section className="au-strengths">
        <Reveal>
          <h2 className="au-gur"><Award size={20} /> ੨੪ Character Strengths</h2>
        </Reveal>
        <div className="au-strengths-grid">
          {Object.entries(CHAR_STRENGTHS).map(([virtue, list], i) => (
            <Reveal key={virtue} delay={(i % 3) * 100}>
              <div className="au-strength-group">
                <h4 className="au-gur">{virtue}</h4>
                <ul>{list.map(s => <li key={s}>{s}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Rule />

      <Reveal>
        <section className="au-cta-band">
          <p>Ready to begin your own MAUJ 1 sheet?</p>
          <button className="au-btn-primary" onClick={() => setPage("mauj")}>Go to MAUJ <ArrowRight size={16} /></button>
        </section>
      </Reveal>
    </div>
  );
}
