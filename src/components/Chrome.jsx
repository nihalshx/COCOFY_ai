import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { contact, media, socials, wa, youtubeId } from '../data/site.js';
import { finePointer, getLenis, reduceMotion, scrollToId } from '../lib/motion.js';
import { Close, Facebook, Instagram, Phone, WhatsApp, YouTube } from './Icons.jsx';

/* Open / closed status from the business hours, in India time */
function istNow() {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const h = +parts.find((p) => p.type === 'hour').value, m = +parts.find((p) => p.type === 'minute').value;
    return h + m / 60;
  } catch { const d = new Date(); return ((d.getUTCHours() + 5.5) % 24) + d.getUTCMinutes() / 60; }
}
const fmtHour = (h) => `${((h + 11) % 12) + 1} ${h < 12 ? 'AM' : 'PM'}`;
export function useOpenStatus() {
  const calc = () => {
    const t = istNow(), open = t >= contact.openHour && t < contact.closeHour;
    return {
      open,
      short: open ? 'Open now' : 'Closed now',
      long: open ? `Open now · until ${fmtHour(contact.closeHour)}` : `Closed now · opens ${fmtHour(contact.openHour)}${t >= contact.closeHour ? ' tomorrow' : ''}`,
      note: open ? '' : `We're closed. Send a WhatsApp message and we'll reply from ${fmtHour(contact.openHour)}.`
    };
  };
  const [st, setSt] = useState(calc);
  useEffect(() => { const id = setInterval(() => setSt(calc()), 60000); return () => clearInterval(id); }, []);
  return st;
}
export function OpenBadge({ long = true, className = '' }) {
  const st = useOpenStatus();
  return <span className={`status ${st.open ? 'is-open' : 'is-closed'} ${className}`}><i aria-hidden="true" />{long ? st.long : st.short}</span>;
}

/* Jump to a section, from any page */
export function useGo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (id) => (e) => {
    if (e) e.preventDefault();
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('no-scroll');
    if (pathname === '/') scrollToId(id);
    else navigate('/', { state: { scrollTo: id } });
  };
}

export function Btn({ href, variant = 'sun', children, magnetic = true, onClick, external = true }) {
  const ext = external && /^https?:/.test(href || '');
  return (
    <a className={`btn btn-${variant}${magnetic ? ' magnetic' : ''}`} href={href} onClick={onClick}
      {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>
      <span className="fill" />
      {children}
    </a>
  );
}

const LINKS = [
  ['#about', 'About'], ['#climb', 'How we work'], ['#services', 'Services'],
  ['#equipment', 'Equipment'], ['#pricing', 'Plans'], ['#contact', 'Contact']
];

export function Nav() {
  const go = useGo();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(window.innerWidth > 899 && y > last.current && y > 400 && !document.body.classList.contains('menu-open'));
      last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('no-scroll', open);
    const l = getLenis();
    if (l) open ? l.stop() : l.start();
  }, [open]);

  const nav = (id) => (e) => {
    if (e) e.preventDefault();
    setOpen(false);
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('no-scroll');
    const l = getLenis(); if (l) l.start();
    requestAnimationFrame(() => go(id)());
  };

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}${hidden && !open ? ' hide' : ''}`}>
        <div className="wrap nav-in">
          <a href="/" className="brand" aria-label="Cocofy home" onClick={nav('#top')}>
            <img src={media('mark-cream.png')} alt="" />Cocofy
          </a>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map(([id, label]) => <a key={id} href={`/${id}`} onClick={nav(id)}>{label}</a>)}
          </nav>
          <div className="nav-cta">
            <a className="nav-phone" href={`tel:${contact.phones[0].tel}`}>
              <b>{contact.phones[0].label}</b><OpenBadge />
            </a>
            <Btn href={wa(contact.bookText)} magnetic={false}>
              <WhatsApp /><span className="btn-label">Book on WhatsApp</span>
            </Btn>
            <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
              onClick={() => setOpen((o) => !o)}><span /></button>
          </div>
        </div>
      </header>
      <div className="mobile-menu" aria-hidden={!open}>
        {LINKS.map(([id, label]) => <a key={id} className="mm" href={`/${id}`} onClick={nav(id)} tabIndex={open ? 0 : -1}>{label}</a>)}
        <div className="mm-actions">
          <a className="btn btn-sun" href={wa(contact.bookText)} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}><span className="fill" /><WhatsApp />WhatsApp</a>
          <a className="btn btn-ghost" href={`tel:${contact.phones[0].tel}`} tabIndex={open ? 0 : -1}><span className="fill" /><Phone />Call</a>
        </div>
        <OpenBadge />
        <div className="mm-foot">
          <span>{contact.phones[0].label} · {contact.email}</span>
          <span className="mm-social">
            <a href={socials.instagram.url} target="_blank" rel="noopener" aria-label="Instagram" tabIndex={open ? 0 : -1}><Instagram /></a>
            <a href={socials.youtube.url} target="_blank" rel="noopener" aria-label="YouTube" tabIndex={open ? 0 : -1}><YouTube /></a>
            <a href={socials.facebook.url} target="_blank" rel="noopener" aria-label="Facebook" tabIndex={open ? 0 : -1}><Facebook /></a>
          </span>
        </div>
      </div>
    </>
  );
}

/* Phones and small tablets: a fixed Call / WhatsApp bar instead of the floating button */
export function MobileBar() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const st = useOpenStatus();
  const barRef = useRef(null);
  useEffect(() => {
    // tell other floating elements (Coco) how tall the bar is right now
    const el = barRef.current; if (!el) return;
    const set = () => document.documentElement.style.setProperty('--mbar-h', show && getComputedStyle(el).display !== 'none' ? `${el.offsetHeight}px` : '0px');
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    addEventListener('resize', set);
    return () => { ro.disconnect(); removeEventListener('resize', set); };
  }, [show, st.open]);
  useEffect(() => {
    // on the home page the hero already has a Book button, so the bar appears after it
    const on = () => setShow(pathname !== '/' || window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [pathname]);
  return (
    <nav ref={barRef} className={`mbar${show ? ' on' : ''}`} aria-label="Quick contact">
      {!st.open && <p className="mbar-note">{st.note}</p>}
      <a href={`tel:${contact.phones[0].tel}`} className={st.open ? 'mbar-call' : 'mbar-call off'}><Phone /><span>Call</span></a>
      <a className="mbar-wa" href={wa(contact.bookText)} target="_blank" rel="noopener"><WhatsApp /><span>Book on WhatsApp</span></a>
    </nav>
  );
}

export function WhatsAppFab() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  useEffect(() => {
    // the hero already has a Book button, so the floating one appears after it
    const on = () => setShow(pathname !== '/' || window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [pathname]);
  return (
    <a className={`wa${show ? ' on' : ''}`} href={wa(contact.bookText)} target="_blank" rel="noopener" aria-label="Chat with Cocofy on WhatsApp">
      <WhatsApp />
    </a>
  );
}

export function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!finePointer || reduceMotion) return;
    const cur = ref.current, ring = cur.firstChild, dot = cur.lastChild;
    let cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy, raf;
    const move = (e) => { cx = e.clientX; cy = e.clientY; cur.classList.add('live'); };
    const over = (e) => cur.classList.toggle('big', !!e.target.closest('a,button,.ecard,summary'));
    const leave = () => cur.classList.remove('live');
    const loop = () => {
      rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', move);
    addEventListener('pointerover', over);
    document.addEventListener('pointerleave', leave);
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('pointerover', over); document.removeEventListener('pointerleave', leave); };
  }, []);
  return <div className="cursor" ref={ref} aria-hidden="true"><div className="ring" /><div className="dot" /></div>;
}

/* Magnetic buttons + 3D tilt cards, bound once per page */
export function useMicroInteractions(rootRef, deps = []) {
  useEffect(() => {
    if (!finePointer || reduceMotion || !rootRef.current) return;
    const root = rootRef.current.ownerDocument;
    const offs = [];
    root.querySelectorAll('.tilt').forEach((el) => {
      const glow = el.querySelector('.glow');
      const mv = (e) => { const b = el.getBoundingClientRect(), px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height; el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 8}deg)`; if (glow) { glow.style.left = px * 100 + '%'; glow.style.top = py * 100 + '%'; } };
      const lv = () => { el.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)'; el.style.transform = ''; setTimeout(() => (el.style.transition = ''), 800); };
      el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', lv);
      offs.push(() => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', lv); });
    });
    return () => offs.forEach((f) => f());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function VideoModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const l = getLenis(); if (l) l.stop();
    const key = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', key);
    return () => { removeEventListener('keydown', key); if (l) l.start(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="How Cocofy works video" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title="How Cocofy works" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        <div className="modal-bar">
          <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener">Open on YouTube</a>
          <button className="modal-close" onClick={onClose} aria-label="Close video"><Close /></button>
        </div>
      </div>
    </div>
  );
}

/* Responsive, multi-format video.
   Phones get the 9:16 file when one is set; screens up to 900px (or data-saver) get the 720p
   files; everything else gets 1080p. AV1 is offered first and H.264 is the fallback. */
const AV1 = 'video/mp4; codecs="av01.0.08M.10"';
function pickVideo(name, mobile, av1) {
  if (typeof window === 'undefined') return { base: name, av1 };
  if (mobile && matchMedia('(max-width: 640px)').matches) return { base: mobile, av1: false };
  const conn = navigator.connection;
  const small = matchMedia('(max-width: 900px)').matches || (conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));
  return { base: small ? `${name}-sm` : name, av1 };
}
export function Video({ name, mobile = null, av1 = true, poster, id, autoPlay = true, loop = true, preload = 'metadata', lazy = false }) {
  const [v, setV] = useState(() => pickVideo(name, mobile, av1));
  const ref = useRef(null);
  // lazy videos only download and play while near the screen
  useEffect(() => {
    if (!lazy) return;
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { if (el.preload !== 'auto') { el.preload = 'auto'; } const p = el.play(); if (p && p.catch) p.catch(() => {}); }
      else el.pause();
    }, { rootMargin: '60% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, v.base]);
  useEffect(() => {
    const mqs = [matchMedia('(max-width: 640px)'), matchMedia('(max-width: 900px)')];
    const on = () => setV(pickVideo(name, mobile, av1));
    mqs.forEach((m) => m.addEventListener('change', on));
    return () => mqs.forEach((m) => m.removeEventListener('change', on));
  }, [name, mobile, av1]);
  return (
    <video key={v.base} ref={ref} id={id} autoPlay={autoPlay && !lazy} muted loop={loop} playsInline preload={lazy ? 'none' : preload} poster={poster}>
      {v.av1 && <source src={media(`${v.base}.av1.mp4`)} type={AV1} />}
      <source src={media(`${v.base}.mp4`)} type="video/mp4" />
    </video>
  );
}
