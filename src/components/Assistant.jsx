import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Coco from './Coco.jsx';
import { useGo, useOpenStatus } from './Chrome.jsx';
import { BOOK_ORDER, BOOK_STEPS, QUICK, answer, bookingMessage } from '../data/assistant.js';
import { wa } from '../data/site.js';
import { finePointer, getLenis, reduceMotion } from '../lib/motion.js';

const STORE = 'cocofy-coco';
const load = () => { try { return JSON.parse(sessionStorage.getItem(STORE)) || null; } catch { return null; } };
const save = (v) => { try { sessionStorage.setItem(STORE, JSON.stringify(v)); } catch { /* storage blocked */ } };

// little hints Coco gives the first time a visitor reaches these sections
const NUDGES = [
  { id: '#pricing', text: 'Not sure which plan fits? Ask me.' },
  { id: '#care', text: 'Tree looking unwell? I can help.' },
  { id: '#faq', text: "Can't find your answer? Ask me!" }
];

let uid = 0;
const id = () => `m${Date.now().toString(36)}${uid++}`;

export default function Assistant() {
  const go = useGo();
  const status = useOpenStatus();
  const { pathname } = useLocation();
  const saved = useRef(load());
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(saved.current?.msgs || []);
  const [booking, setBooking] = useState(saved.current?.booking || null); // { step, data }
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [bubble, setBubble] = useState(null);
  const [mood, setMood] = useState('idle');
  const [shown, setShown] = useState(false);
  const [inHero, setInHero] = useState(true);
  const small = typeof window !== 'undefined' && matchMedia('(max-width: 899px)').matches;
  useEffect(() => {
    const on = () => setInHero(pathname === '/' && window.scrollY < window.innerHeight * 0.6);
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [pathname]);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const timers = useRef([]);
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => { save({ msgs: msgs.slice(-40), booking }); }, [msgs, booking]);

  /* appear a moment after the page loads */
  useEffect(() => { const t = setTimeout(() => setShown(true), 1800); return () => clearTimeout(t); }, []);

  /* first-visit greeting bubble */
  useEffect(() => {
    if (!shown || saved.current?.greeted || (small && inHero)) return;
    const t1 = setTimeout(() => { setBubble('Hi! I\'m Coco. Ask me anything about Cocofy.'); setMood('wave'); }, 2500);
    const t2 = setTimeout(() => { setBubble(null); setMood('idle'); }, 9500);
    saved.current = { ...(saved.current || {}), greeted: true };
    try { const v = load() || {}; sessionStorage.setItem(STORE, JSON.stringify({ ...v, greeted: true })); } catch { /* */ }
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, inHero]);

  /* section nudges, once each, at most two per visit */
  useEffect(() => {
    if (pathname !== '/') return;
    let count = 0; const seen = new Set();
    const io = new IntersectionObserver((ens) => {
      ens.forEach((en) => {
        const n = NUDGES.find((x) => `#${en.target.id}` === x.id);
        if (!n || !en.isIntersecting || seen.has(n.id) || count >= 2 || document.querySelector('.coco-panel.on')) return;
        seen.add(n.id); count++;
        setBubble(n.text); setMood('happy');
        later(() => { setBubble((b) => (b === n.text ? null : b)); setMood('idle'); }, 6000);
      });
    }, { threshold: 0.35 });
    const t = setTimeout(() => NUDGES.forEach((n) => { const el = document.querySelector(n.id); if (el) io.observe(el); }), 1500);
    return () => { clearTimeout(t); io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* hide when the mobile menu or video popup is open */
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const check = () => setHidden(document.body.classList.contains('menu-open') || !!document.querySelector('.modal'));
    const mo = new MutationObserver(check);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true, subtree: false });
    return () => mo.disconnect();
  }, []);

  /* lock page scroll behind the full-screen sheet on phones */
  useEffect(() => {
    const phone = matchMedia('(max-width: 640px)').matches;
    const l = getLenis();
    if (open) { if (phone) document.documentElement.classList.add('no-scroll'); }
    else document.documentElement.classList.remove('no-scroll');
    if (l) { /* keep page scroll on desktop; the list has data-lenis-prevent */ }
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [open]);

  /* keep the newest message in view */
  useLayoutEffect(() => {
    const l = listRef.current; if (l) l.scrollTo({ top: l.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [msgs, typing, open]);

  /* ---- conversation ---- */
  const botSay = useCallback((m, delay) => {
    setTyping(true); setMood('talk');
    const len = (m.text || '').length;
    const wait = delay ?? (reduceMotion ? 150 : Math.min(1400, 450 + len * 6));
    later(() => {
      setTyping(false);
      setMsgs((prev) => [...prev, { id: id(), from: 'bot', ...m }]);
      setMood(m.mood || 'happy');
      later(() => setMood('idle'), 1600);
    }, wait);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const askStep = useCallback((step, data) => {
    const s = BOOK_STEPS[step];
    setBooking({ step, data });
    botSay({ text: s.ask, chips: s.chips ? s.chips.map((c) => ({ label: c, send: c })) : undefined, input: s.input || s.free });
    if (step === 'place') later(() => inputRef.current?.focus(), 900);
  }, [botSay]);

  const finishBooking = useCallback((data) => {
    setBooking(null);
    const msg = bookingMessage(data);
    botSay({
      text: `Here's your booking message. Tap the button to send it to the Cocofy team on WhatsApp.${status.open ? '' : ' We\'re closed right now, so they\'ll reply from 7 AM.'}`,
      card: msg,
      actions: [{ type: 'link', href: wa(msg), label: 'Send on WhatsApp', wa: true }, { type: 'say', text: 'book', label: 'Start again' }],
      mood: 'wave'
    });
  }, [botSay, status.open]);

  const handle = useCallback((raw) => {
    const input = raw.trim(); if (!input) return;
    const isCmd = input === 'book';
    setMsgs((prev) => [...prev, { id: id(), from: 'me', text: isCmd ? 'I want to book a harvest' : input }]);
    setText('');
    setMood('think');

    // in the middle of booking: a question gets answered (booking pauses); anything else fills the current step
    const isQuestion = /\?\s*$/.test(input) || /^(how|what|why|can|could|do|does|is|are|when|where|which|who|will|should|tell)\b/i.test(input);
    if (booking && !isCmd && isQuestion) {
      const r = answer(input, { status });
      if (r.start === 'book') { later(() => askStep(booking.step, booking.data), 50); return; }
      botSay({ ...r, chips: undefined, actions: [...(r.actions || []).filter((x) => x.type !== 'book'), { type: 'resume', label: 'Continue booking' }] });
      return;
    }
    if (booking && !isCmd) {
      const data = { ...booking.data, [booking.step]: input };
      const next = BOOK_ORDER.slice(BOOK_ORDER.indexOf(booking.step) + 1).find((s) => !data[s]);
      if (next) askStep(next, data); else finishBooking(data);
      return;
    }
    const r = isCmd ? { start: 'book' } : answer(input, { status });
    if (r.start === 'book') {
      const data = r.trees ? { trees: r.trees } : {};
      later(() => askStep('service', data), 50);
      return;
    }
    botSay(r);
  }, [booking, askStep, finishBooking, botSay, status]);

  const openPanel = () => {
    setOpen(true); setBubble(null); setMood('wave');
    later(() => setMood('idle'), 1400);
    if (msgs.length === 0) {
      botSay({
        text: `Namaskaram! I'm Coco, Cocofy's assistant. I can explain our coconut harvesting and tree care, or help you book a visit in under a minute. ${status.open ? "We're open now until 7 PM." : 'The team is offline now and replies from 7 AM, but I can still help.'}`,
        chips: QUICK, mood: 'wave'
      }, 500);
    }
    if (finePointer) later(() => inputRef.current?.focus(), 400);
  };

  const restart = () => { setMsgs([]); setBooking(null); botSay({ text: 'Fresh start! What can I help you with?', chips: QUICK }, 300); };

  const runAction = (a) => {
    if (a.type === 'go') { if (matchMedia('(max-width: 640px)').matches) setOpen(false); later(() => go(a.id)(), 60); }
    else if (a.type === 'say') handle(a.text);
    else if (a.type === 'book') handle('book');
    else if (a.type === 'resume' && booking) askStep(booking.step, booking.data);
  };

  const last = msgs[msgs.length - 1];
  const placeholder = booking ? (BOOK_STEPS[booking.step].input || BOOK_STEPS[booking.step].free || 'Type your answer') : 'Ask Coco about Cocofy…';

  return (
    <div className={`coco-root${shown ? ' shown' : ''}${hidden ? ' gone' : ''}${open ? ' is-open' : ''}${inHero ? ' in-hero' : ''}`}>
      {/* launcher */}
      <button ref={launcherRef} className="coco-launcher" onClick={() => (open ? setOpen(false) : openPanel())}
        onPointerEnter={() => !open && setMood('happy')} onPointerLeave={() => !open && setMood('idle')}
        aria-label={open ? 'Close Coco assistant' : 'Ask Coco, the Cocofy assistant'} aria-expanded={open}>
        <Coco mood={open ? "idle" : mood} size={84} />
        <span className="coco-x" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6 6 18" /></svg></span>
        {msgs.length === 0 && <span className="coco-ping" aria-hidden="true" />}
      </button>
      {bubble && !open && (
        <button className="coco-bubble" onClick={openPanel}>
          {bubble}
          <span className="coco-bubble-x" role="button" aria-label="Dismiss" onClick={(e) => { e.stopPropagation(); setBubble(null); setMood('idle'); }}>×</span>
        </button>
      )}

      {/* panel */}
      <section className={`coco-panel${open ? ' on' : ''}`} role="dialog" aria-modal="false" aria-label="Coco, the Cocofy assistant" aria-hidden={!open}>
        <header className="coco-head">
          <div className="coco-head-avatar"><Coco mood={typing ? 'talk' : mood} size={48} badge /></div>
          <div className="coco-head-text">
            <b>Coco</b>
            <span className={`status ${status.open ? 'is-open' : 'is-closed'}`}><i aria-hidden="true" />{status.open ? 'Cocofy team online now' : 'Team replies from 7 AM'}</span>
          </div>
          <a className="coco-icon coco-icon-wa" href={wa()} target="_blank" rel="noopener" aria-label="Chat with the Cocofy team on WhatsApp" title="WhatsApp the team" tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
          </a>
          <button className="coco-icon" onClick={restart} aria-label="Start a new chat" title="Start again" tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" /></svg>
          </button>
          <button className="coco-icon" onClick={() => setOpen(false)} aria-label="Close" tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <div className="coco-list" ref={listRef} data-lenis-prevent aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`coco-msg from-${m.from}`}>
              {m.text && <p>{m.text}</p>}
              {m.card && <pre className="coco-card">{m.card}</pre>}
              {m.actions && (
                <div className="coco-actions">
                  {m.actions.map((a, i) => a.type === 'link'
                    ? <a key={i} className={`coco-act${a.wa ? ' wa-act' : ''}`} href={a.href} target={a.href.startsWith('tel:') ? undefined : '_blank'} rel="noopener" tabIndex={open ? 0 : -1}>{a.label}</a>
                    : <button key={i} className="coco-act" onClick={() => runAction(a)} tabIndex={open ? 0 : -1}>{a.type === 'book' ? 'Book a visit' : a.label}</button>)}
                </div>
              )}
            </div>
          ))}
          {typing && <div className="coco-msg from-bot coco-typing" aria-label="Coco is typing"><i /><i /><i /></div>}
          {!typing && last && last.from === 'bot' && last.chips && (
            <div className="coco-chips">
              {last.chips.map((c, i) => <button key={c.label} style={{ animationDelay: `${i * 45}ms` }} onClick={() => handle(c.send)} tabIndex={open ? 0 : -1}>{c.label}</button>)}
            </div>
          )}
        </div>

        <form className="coco-form" onSubmit={(e) => { e.preventDefault(); handle(text); }}>
          <label htmlFor="coco-input" className="sr-only">Message Coco</label>
          <input id="coco-input" ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} autoComplete="off" maxLength={300} tabIndex={open ? 0 : -1} />
          <button type="submit" className="coco-send" aria-label="Send" disabled={!text.trim()} tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2z" /></svg>
          </button>
        </form>
        <p className="coco-foot">Coco answers from Cocofy's own service details. For bookings, the team confirms on WhatsApp.</p>
      </section>
    </div>
  );
}
