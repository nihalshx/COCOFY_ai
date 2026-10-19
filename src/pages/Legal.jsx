import { useEffect } from 'react';
import { Footer } from '../components/Sections.jsx';
import { contact } from '../data/site.js';

const UPDATED = 'October 2026';

const PAGES = {
  privacy: {
    title: 'Privacy policy',
    intro: 'This policy explains what information Cocofy collects when you visit cocofy.in or contact us, and how we use it.',
    sections: [
      ['Information we collect', [
        'This website has no sign-up or contact forms. We only receive personal information when you choose to contact us by phone, WhatsApp or email.',
        'When you contact us, we may receive your name, phone number, location or address, the number and condition of your trees, and any photos or messages you send.'
      ]],
      ['How we use it', [
        'We use your information only to respond to you, quote a price, schedule and carry out harvesting or tree care work, and follow up on that work.',
        'We do not sell or rent your personal information to anyone.'
      ]],
      ['Third-party services', [
        'Conversations on WhatsApp, phone or email are also handled by those providers under their own privacy policies.',
        'The website loads fonts from Google Fonts, and the "How we work" video is played from YouTube when you choose to open it. These services may receive technical data such as your IP address.'
      ]],
      ['Keeping and deleting your information', [
        'We keep booking details only as long as we need them to serve you and keep basic business records.',
        `You can ask us to see, correct or delete your information at any time by writing to ${contact.email}.`
      ]],
      ['Changes', ['We may update this policy. The date at the top shows when it last changed.']]
    ]
  },
  terms: {
    title: 'Terms of service',
    intro: 'These terms apply when you use cocofy.in or book a service with Cocofy. By booking, you agree to them.',
    sections: [
      ['Bookings', [
        'You can request a service by phone, WhatsApp or email. A booking is confirmed once we agree a date and a price with you.',
        'Visit dates depend on your location, the condition of your trees and the weather. We may reschedule for safety reasons, such as heavy rain or strong wind, and will tell you as early as we can.'
      ]],
      ['Prices', [
        'Prices depend on the number of trees, their height, your location and the plan you choose. We tell you the price before work starts, with no hidden charges.'
      ]],
      ['Safety and access', [
        'Please give our team safe access to the trees and let us know about hazards such as power lines, weak or damaged trees, or structures close to the trunk.',
        'Our climbers may decline to climb a tree they judge unsafe. Where that happens, we will explain why.'
      ]],
      ['Tree care advice', [
        'Health checks and care recommendations are based on what our team can see during the visit. Results of treatment can vary with soil, weather and the age of the tree.'
      ]],
      ['Website content', [
        'Text, photos, videos and the Cocofy logo on this website belong to Cocofy and may not be reused without permission.'
      ]],
      ['Contact', [`Questions about these terms: ${contact.email} or ${contact.phones[0].label}.`]]
    ]
  }
};

export default function Legal({ page }) {
  const p = PAGES[page];
  useEffect(() => { window.scrollTo(0, 0); document.title = `${p.title} · Cocofy`; return () => { document.title = 'Cocofy Coconut Harvesting'; }; }, [p]);
  return (
    <>
      <main className="legal">
        <div className="wrap legal-in">
          <span className="eyebrow">Last updated {UPDATED}</span>
          <h1>{p.title}</h1>
          <p className="legal-intro">{p.intro}</p>
          {p.sections.map(([h, paras]) => (
            <section key={h}>
              <h2>{h}</h2>
              {paras.map((t, i) => <p key={i}>{t}</p>)}
            </section>
          ))}
        </div>
      </main>
      <Footer cta={false} />
    </>
  );
}
