import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  careItems, careersText, contact, equipment, faqs, media, plans, reviews, services, socials,
  stats, steps, team, videos, wa, why
} from '../data/site.js';
import { finePointer, reduceMotion } from '../lib/motion.js';
import { Btn, OpenBadge, useGo, Video } from './Chrome.jsx';
import {
  Arrow, Check, Facebook, Instagram, LinkedIn, Play, Plus, WhatsApp, WhyIcon, YouTube
} from './Icons.jsx';

/* ---------------- hero ---------------- */
export function Hero({ onPlay }) {
  return (
    <section className="hero" id="hero" aria-label="Introduction">
      <div className="hero-media" id="heroMedia">
        <Video name={videos.hero} mobile={videos.heroMobile} preload="auto" poster={media('hero-poster.jpg')} />
      </div>
      <div className="hero-shade" />
      <div className="hero-side" aria-hidden="true">Padanna · Kasaragod · Kerala</div>
      <div className="wrap hero-content" id="heroContent">
        <span className="eyebrow"><span className="hide-sm">Trained climbers · Modern climbing machines · Kasaragod</span><span className="show-sm">Trained climbers · Kasaragod</span></span>
        <h1 id="heroTitle">
          <span className="w"><span>Coconut</span></span> <span className="w"><span>harvesting</span></span>{' '}
          <span className="w"><span className="script">&amp; tree care</span></span> <span className="w"><span className="script">in Kerala</span></span>
        </h1>
        <div className="hero-row">
          <p className="hero-lead hero-fade">Safe, on-time harvesting for homes, farms and plantations, without damage to your trees or property. We also check, clean and treat your palms to keep them productive.</p>
          <div className="hero-actions hero-fade">
            <Btn href={wa(contact.bookText)}>Book a harvest <Arrow className="arrow" /></Btn>
            <button className="play" onClick={onPlay} aria-label="Watch how we work">
              <span className="play-ring"><Play /></span><span className="play-label">Watch how<br />we work</span>
            </button>
          </div>
        </div>
      </div>
      <span className="scroll-cue" aria-hidden="true" />
    </section>
  );
}

/* ---------------- ticker ---------------- */
export function Ticker() {
  const words = ['Coconut harvesting', 'Tree health checks', 'ml', 'Pruning & cleaning', 'Tree medicine', 'Pest advice', 'Plantation consulting'];
  const row = (k) => (
    <div className="ticker-item" key={k}>
      {words.map((w, i) => (
        <span key={i} className="ticker-word">
          {w === 'ml' ? <span className="ml">തെങ്ങുകയറ്റം</span> : w}
          <img src={media('mark-green.png')} alt="" />
        </span>
      ))}
    </div>
  );
  return <div className="ticker" aria-hidden="true"><div className="ticker-track">{row(1)}{row(2)}</div></div>;
}

/* ---------------- about ---------------- */
export function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <span className="eyebrow">About Cocofy</span>
        <div className="about-grid">
          <div>
            <p className="about-statement" id="statement">
              Cocofy is a coconut harvesting and tree care service from Padanna, Kasaragod. Our <span className="hl">trained climbers</span> use <span className="hl">modern climbing machines</span>, so every harvest is safe, on time and gentle on the tree.
            </p>
            <div className="about-body">
              <p className="rv">Our climbers harvest without damaging the tree or the property around it. Beyond harvesting, we run health checks, basic maintenance and treatment support to stop the common problems that cut a palm's productivity.</p>
              <p className="rv">We serve homeowners, farmers and plantation owners across Kerala from our base in Padanna, Kasaragod, with fair pricing and consistent results you can plan around.</p>
            </div>
          </div>
          <figure className="about-figure rv">
            <img id="aboutImg" src={media('climber-portrait.webp')} alt="A Cocofy climber seated in a mechanical climbing machine high on a coconut palm" loading="lazy" />
            <figcaption className="tag"><span>Machine climb</span><span>Kasaragod</span></figcaption>
          </figure>
        </div>
        <div className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              {s.value ? <span className="stat-num">{s.value}</span> : <span className="stat-num"><span className="count" data-to={s.to}>{s.to}</span><sup>{s.suffix}</sup></span>}
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- climb (scroll scrub) ---------------- */
export function Climb() {
  return (
    <section className="climb" id="climb" aria-label="How we work">
      <Video id="climbVideo" name={videos.climb} mobile={videos.climbMobile} av1={false} autoPlay={false} loop={false} preload="metadata" poster={media('climb-poster.jpg')} />
      <div className="climb-shade" />
      <div className="wrap climb-ui">
        <div className="meter" aria-hidden="true">
          <div className="rail"><i id="meterFill" /></div>
          {steps.map((s, i) => <span key={s.title}>{String(steps.length - i).padStart(2, '0')}</span>)}
          <div className="meter-read" id="meterRead">Step 1 of {steps.length}</div>
        </div>
        <div className="climb-copy">
          <span className="eyebrow">How we work</span>
          <h2>Booking a harvest takes <em className="sun">one message.</em></h2>
          <div className="steps">
            {steps.map((s, i) => (
              <div className={`step${i === 0 ? ' on' : ''}`} key={s.title}>
                <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{s.title}</h3><p>{s.text}</p></div>
              </div>
            ))}
          </div>
          <div className="step-dots" aria-hidden="true">{steps.map((s, i) => <i key={s.title} className={i === 0 ? 'on' : ''} />)}</div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- services ---------------- */
export function Services() {
  const [hover, setHover] = useState(-1);
  const fl = useRef(null);
  useEffect(() => {
    if (!finePointer || reduceMotion) return;
    let fx = 0, fy = 0, tx = 0, ty = 0, raf;
    const mv = (e) => { tx = e.clientX + 180; ty = e.clientY; };
    const loop = () => { fx += (tx - fx) * 0.12; fy += (ty - fy) * 0.12; if (fl.current) { fl.current.style.left = fx + 'px'; fl.current.style.top = fy + 'px'; } raf = requestAnimationFrame(loop); };
    addEventListener('pointermove', mv); loop();
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', mv); };
  }, []);
  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="sec-head">
          <div><span className="eyebrow">Services</span><h2 className="rv">Our services</h2></div>
          <p className="rv">Three ways to work with us, from a one-time harvest at your home to a full plan for a plantation.</p>
        </div>
        <div className="svc-list">
          {services.map((s, i) => (
            <a className="svc rv" key={s.title} href={wa(s.wa)} target="_blank" rel="noopener"
              onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(-1)}>
              <span className="svc-n">{s.tag}</span><h3>{s.title}</h3><p>{s.text}</p>
              <span className="svc-go"><Arrow /></span>
            </a>
          ))}
        </div>
      </div>
      {finePointer && (
        <div className={`svc-float${hover >= 0 ? ' on' : ''}`} ref={fl} aria-hidden="true">
          {services.map((s, i) => <img key={s.img} src={media(s.img)} alt="" className={i === hover ? 'on' : ''} />)}
        </div>
      )}
    </section>
  );
}

/* ---------------- tree care ---------------- */
export function TreeCare() {
  return (
    <section className="care" id="care">
      <div className="care-film" id="careFilm">
        <Video lazy name={videos.care} poster={media('care-poster.jpg')} />
        <div className="care-film-shade" />
        <div className="wrap care-film-copy">
          <span className="eyebrow">Tree care</span>
          <h2>Coconut <em className="sun">tree care</em></h2>
          <p>Harvesting is only half the job. A healthy palm gives more coconuts every season, so our team looks after the whole tree.</p>
        </div>
      </div>
      <div className="wrap"><div className="care-grid snap-row">
        {careItems.map((c) => (
          <article className="care-item rv" key={c.title}>
            <span className="care-tag">{c.tag}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </div></div>
    </section>
  );
}

/* ---------------- equipment ---------------- */
export function Equipment() {
  return (
    <section className="equip" id="equipment" aria-label="Our equipment">
      <div className="equip-track" id="equipTrack">
        <div className="equip-intro">
          <Video lazy name={videos.machine} poster={media('machine-poster.jpg')} />
          <div className="shade" />
          <div className="wrap">
            <span className="eyebrow">Equipment</span>
            <h2>The equipment we use</h2>
            <p>Mechanical climbers grip the trunk, so our team rises steadily with both hands free. It is safer for the climber and kinder to the tree.</p>
            <span className="hint"><i />Keep scrolling</span>
          </div>
        </div>
        <div className="equip-cards snap-row">
        {equipment.map((e) => (
          <div className="equip-card" key={e.title}>
            <article className={`ecard tilt${e.light ? ' ecard-light' : ''}`}>
              <div className="glow" />
              <div className="ecard-top"><span>{e.tag}</span><span>{e.meta}</span></div>
              <div className="ecard-img"><img src={media(e.img)} alt={e.title} loading="lazy" /></div>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </article>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- why ---------------- */
export function Why() {
  return (
    <section className="why" id="why">
      <div className="wrap why-grid">
        <div className="why-head">
          <span className="eyebrow">Why Cocofy</span>
          <h2>Why customers choose Cocofy</h2>
          <p>From a single backyard palm to a full plantation, we focus on safety, efficiency and proper tree handling that protects long-term yield.</p>
        </div>
        <div className="why-list">
          {why.map((w) => (
            <div className="why-item rv" key={w.title}>
              <span className="why-ic"><WhyIcon name={w.icon} /></span>
              <div><h3>{w.title}</h3><p>{w.text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- pricing ---------------- */
export function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="wrap">
        <div className="sec-head">
          <div><span className="eyebrow">Plans</span><h2 className="rv">Service plans</h2></div>
          <p className="rv">Every quote depends on tree count, height and location. Message us and we'll reply with a clear price.</p>
        </div>
        <div className="plans snap-row">
          {plans.map((p) => (
            <article className={`plan rv${p.feature ? ' feature' : ''}`} key={p.title}>
              <span className="plan-tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <ul>{p.items.map((it) => <li key={it}><Check />{it}</li>)}</ul>
              <Btn href={wa(p.wa)} variant={p.feature ? 'dark' : 'ghost'} magnetic={false}>{p.cta}</Btn>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- testimonials ---------------- */
function Quote({ r }) {
  return (
    <figure className="quote">
      <blockquote>“{r[1]}”</blockquote>
      <figcaption><span className="av">{r[0].charAt(0)}</span><span><b>{r[0]}</b><small>Customer</small></span></figcaption>
    </figure>
  );
}
export function Voices() {
  const a = reviews, b = [...reviews].reverse();
  return (
    <section className="voices" id="voices" aria-label="Customer reviews">
      <div className="wrap">
        <div className="sec-head">
          <div><span className="eyebrow">Customers</span><h2 className="rv">What our customers say</h2></div>
          <p className="rv">Feedback from homeowners and farmers we've worked with.</p>
        </div>
      </div>
      <div className="v-row">{[...a, ...a].map((r, i) => <Quote key={i} r={r} />)}</div>
      <div className="v-row rev">{[...b, ...b].map((r, i) => <Quote key={i} r={r} />)}</div>
    </section>
  );
}

/* ---------------- team ---------------- */
const PERSON_ICONS = { instagram: Instagram, linkedin: LinkedIn, facebook: Facebook };
export function Team() {
  return (
    <section className="team" id="team">
      <div className="wrap">
        <div className="sec-head">
          <div><span className="eyebrow">Our team</span><h2 className="rv">Meet the team</h2></div>
          <p className="rv">A Kasaragod team building a better way to look after Kerala's coconut trees.</p>
        </div>
        <div className="people snap-row">
          {team.map((p) => {
            const links = Object.entries(p.links || {}).filter(([, url]) => url);
            return (
              <figure className="person rv" key={p.name}>
                <img src={media(p.photo)} alt={`${p.name}, ${p.role} of Cocofy`} loading="lazy" />
                <figcaption>
                  <span><b>{p.name}</b><small>{p.role}</small></span>
                  {links.length > 0 ? (
                    <span className="p-links">
                      {links.map(([k, url]) => { const I = PERSON_ICONS[k]; return <a key={k} href={url} target="_blank" rel="noopener" aria-label={`${p.name} on ${k}`}><I /></a>; })}
                    </span>
                  ) : <img className="mk" src={media('mark-green.png')} alt="" />}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- follow ---------------- */
export function Follow() {
  const cards = [
    { k: 'instagram', I: Instagram, name: 'Instagram', handle: socials.instagram.handle, url: socials.instagram.url, text: 'Harvest days, our team at work and tree care tips.' },
    { k: 'youtube', I: YouTube, name: 'YouTube', handle: socials.youtube.handle, url: socials.youtube.url, text: 'Watch our climbers and machines in action.' },
    { k: 'facebook', I: Facebook, name: 'Facebook', handle: socials.facebook.handle, url: socials.facebook.url, text: 'Updates and news from Cocofy.' }
  ];
  return (
    <section className="follow" id="follow">
      <div className="wrap">
        <div className="sec-head">
          <div><span className="eyebrow">Stay connected</span><h2 className="rv">Follow Cocofy</h2></div>
          <p className="rv">Coconut harvesting updates and tree care tips on Instagram, YouTube and Facebook.</p>
        </div>
        <div className="follow-grid">
          {cards.map(({ k, I, name, handle, url, text }) => (
            <a className={`fcard fcard-${k} rv`} key={k} href={url} target="_blank" rel="noopener">
              <span className="fcard-ic"><I /></span>
              <span className="fcard-name">{name}</span>
              <b className="fcard-handle">{handle}</b>
              <span className="fcard-text">{text}</span>
              <span className="fcard-go">Follow <Arrow className="arrow" /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- faq ---------------- */
export function Faq() {
  return (
    <section className="faq" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <span className="eyebrow">FAQs</span>
          <h2 className="rv">Frequently asked questions</h2>
          <p className="rv">Can't find your answer? Message us on WhatsApp and the team will reply.</p>
          <Btn href={wa('Hi Cocofy, I have a question.')} variant="dark">Ask on WhatsApp <Arrow className="arrow" /></Btn>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details className="qa rv" key={f.q}>
              <summary><span>{f.q}</span><i><Plus /></i></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- footer ---------------- */
export function Footer({ cta = true }) {
  const go = useGo();
  const [copied, setCopied] = useState('Copy email');
  const emailRef = useRef(null);
  const copy = () => {
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(emailRef.current); const s = getSelection(); s.removeAllRanges(); s.addRange(r); setCopied('Selected'); };
    try { navigator.clipboard.writeText(contact.email).then(() => setCopied('Copied'), fallback); } catch { fallback(); }
    setTimeout(() => setCopied('Copy email'), 1800);
  };
  return (
    <footer className={`final${cta ? '' : ' slim'}`} id="contact">
      {cta && (
        <>
          <div className="final-bg" id="finalBg">
            <Video lazy name={videos.dusk} poster={media('dusk-poster.webp')} />
          </div>
          <div className="final-shade" />
          <div className="wrap final-cta">
            <span className="eyebrow">Book a visit</span>
            <h2 className="rv">Book your <em className="sun">coconut harvest</em></h2>
            <p className="rv">Send us a WhatsApp message with your location and number of trees. We'll confirm a date and a clear price.</p>
            <OpenBadge long className="rv" />
            <div className="hero-actions rv">
              <Btn href={wa(contact.bookText)}>Message on WhatsApp <Arrow className="arrow" /></Btn>
              <Btn href={`tel:${contact.phones[0].tel}`} variant="ghost" external={false}>{contact.phones[0].label}</Btn>
            </div>
          </div>
        </>
      )}
      <div className="wrap">
        <div className="contact-grid">
          <div><h4>Visit</h4><p>{contact.address[0]}<br />{contact.address[1]}</p><a className="map-link" href="https://www.google.com/maps/search/?api=1&query=Padanna%2C+Kasaragod%2C+Kerala" target="_blank" rel="noopener">Open in Google Maps</a></div>
          <div><h4>Call</h4>{contact.phones.map((p) => <a key={p.tel} href={`tel:${p.tel}`}>{p.label}</a>)}<p className="muted">{contact.hours}</p><OpenBadge /></div>
          <div><h4>Write</h4><a href={`mailto:${contact.email}`} ref={emailRef}>{contact.email}</a><button className="copy-btn" type="button" onClick={copy}>{copied}</button></div>
          <div><h4>Follow</h4>
            <div className="socials">
              <a href={socials.instagram.url} target="_blank" rel="noopener" aria-label="Instagram"><Instagram /></a>
              <a href={socials.facebook.url} target="_blank" rel="noopener" aria-label="Facebook"><Facebook /></a>
              <a href={socials.youtube.url} target="_blank" rel="noopener" aria-label="YouTube"><YouTube /></a>
              <a href={wa()} target="_blank" rel="noopener" aria-label="WhatsApp"><WhatsApp /></a>
            </div>
          </div>
        </div>
        <nav className="foot-links" aria-label="Footer">
          <a href="/#faq" onClick={go('#faq')}>FAQs</a>
          <a href={wa(careersText)} target="_blank" rel="noopener">Careers</a>
          <a href={wa('Hi Cocofy, I need help with a booking.')} target="_blank" rel="noopener">Help center</a>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms of service</Link>
        </nav>
      </div>
      {cta && <div className="wordmark" id="wordmark" aria-hidden="true">{'COCOFY'.split('').map((l, i) => <span key={i}>{l}</span>)}</div>}
      <div className="wrap foot-bar"><span>© {new Date().getFullYear()} Cocofy.in · All rights reserved</span><span>Coconut harvesting &amp; tree care · Kasaragod, Kerala</span></div>
    </footer>
  );
}
