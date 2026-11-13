import React from 'react';
import { Code2, GraduationCap, ShieldCheck, UserRound, Linkedin, Github, Mail } from 'lucide-react';

const people = [
  { name: 'Lakshmi Rajput', role: 'Developer', detail: 'First Year • CSD Branch', initials: 'LR' },
  { name: 'Deeya Rajpoot', role: 'Developer', detail: 'First Year • CSD Branch', initials: 'DR' },
];

export const DevelopersView: React.FC = () => {
  return (
    <div className="cp-developers-page max-w-6xl mx-auto">
      <section className="cp-developers-hero">
        <div className="cp-developers-hero-icon"><Code2 className="w-7 h-7" /></div>
        <span className="cp-kicker">CYBERPROOF PROJECT</span>
        <h1>Developed by</h1>
        <p>Meet the student developers behind CyberProof and the faculty member guiding the project.</p>
      </section>

      <section className="cp-credit-section">
        <div className="cp-section-head">
          <div><span className="cp-kicker">01 / DEVELOPMENT TEAM</span><h2>Student developers</h2></div>
          <p>First Year • CSD Branch</p>
        </div>
        <div className="cp-developer-card-grid">
          {people.map(person => (
            <article className="cp-developer-card" key={person.name}>
              <div className="cp-developer-avatar">{person.initials}</div>
              <div>
                <span className="cp-credit-label">{person.role}</span>
                <h3>{person.name}</h3>
                <p><GraduationCap className="w-4 h-4" />{person.detail}</p>
                <div className="cp-social-icons" aria-label={`${person.name} profile links`}>
                  <button type="button" className="cp-social-icon" title="LinkedIn profile — coming soon" aria-label="LinkedIn profile coming soon"><Linkedin className="w-4 h-4" /></button>
                  <button type="button" className="cp-social-icon" title="GitHub profile — coming soon" aria-label="GitHub profile coming soon"><Github className="w-4 h-4" /></button>
                  <button type="button" className="cp-social-icon" title="Email — coming soon" aria-label="Email coming soon"><Mail className="w-4 h-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cp-guidance-card">
        <div className="cp-guidance-icon"><ShieldCheck className="w-7 h-7" /></div>
        <div>
          <span className="cp-kicker">02 / FACULTY GUIDANCE</span>
          <h2>Built under the guidance of</h2>
          <div className="cp-guidance-person">
            <div className="cp-developer-avatar cp-guide-avatar">RA</div>
            <div><h3>Dr. Rohit Agarwal</h3><p><UserRound className="w-4 h-4" />Assistant Professor</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};
