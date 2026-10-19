import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { VideoModal, useMicroInteractions } from '../components/Chrome.jsx';
import {
  About, Climb, Equipment, Faq, Follow, Footer, Hero, Pricing, Services, Team, Ticker, TreeCare, Voices, Why
} from '../components/Sections.jsx';
import { gsap, ScrollTrigger, getLenis, reduceMotion, scrollToId, session } from '../lib/motion.js';
import { media } from '../data/site.js';

function introSeen() { try { return sessionStorage.getItem('cocofy-intro') === '1'; } catch { return false; } }
function markIntroSeen() { try { sessionStorage.setItem('cocofy-intro', '1'); } catch { /* storage blocked */ } }

export default function Home() {
  const root = useRef(null);
  const location = useLocation();
  const [video, setVideo] = useState(false);
  // arriving from another page (or a #link) to a specific section: skip the intro and go straight there
  const arriving = !!((location.state && location.state.scrollTo) || /^#[a-z]+$/.test(location.hash));
  const [showLoader, setShowLoader] = useState(!session.introPlayed && !reduceMotion && !introSeen() && !arriving);
  const openVideo = useCallback(() => setVideo(true), []);
  const closeVideo = useCallback(() => setVideo(false), []);

  useMicroInteractions(root);

  useLayoutEffect(() => {
    const q = (s) => root.current.querySelector(s);
    const qa = (s) => Array.from(root.current.querySelectorAll(s));
    const lenis = getLenis();
    const cleanups = [];
    const pendingScroll = (location.state && location.state.scrollTo) ||
      (/^#[a-z]+$/.test(location.hash) ? location.hash : null);

    const ctx = gsap.context(() => {
      /* ---- intro ---- */
      const heroWords = qa('#heroTitle .w > span');
      const finishIntro = () => {
        session.introPlayed = true;
        markIntroSeen();
        setShowLoader(false);
        if (lenis) lenis.start();
        if (pendingScroll) setTimeout(() => { ScrollTrigger.refresh(); scrollToId(pendingScroll, true); window.history.replaceState({}, ''); }, 120);
      };
      if (!session.introPlayed && !reduceMotion && !introSeen() && !pendingScroll) {
        gsap.set(heroWords, { yPercent: 110 });
        gsap.set('.hero-fade, .hero .eyebrow', { opacity: 0, y: 24 });
        gsap.set('#heroMedia', { scale: 1.18 });
        if (lenis) lenis.stop();
        gsap.timeline({ delay: 0.15, onComplete: finishIntro })
          .to('#loaderFill', { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power2.inOut' }, 0)
          .to('.loader-inner', { y: -20, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.85)
          .to('#loader', { clipPath: 'inset(0 0 100% 0)', duration: 0.75, ease: 'expo.inOut' }, 1.0)
          .to('#heroMedia', { scale: 1, duration: 2, ease: 'expo.out' }, 1.05)
          .to('.hero .eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.3)
          .to(heroWords, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 1.35)
          .to('.hero-fade', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 1.6);
      } else {
        finishIntro();
      }

      /* ---- hero parallax ---- */
      gsap.to('#heroMedia', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('#heroContent', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '80% top', scrub: true } });

      /* ---- reveals ---- */
      ScrollTrigger.batch(qa('.rv'), {
        start: 'top 88%',
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, overwrite: true })
      });

      /* ---- about: word fill, counters ---- */
      const st = q('#statement');
      if (!st.dataset.split) {
        st.dataset.split = '1';
        const wrap = (node) => {
          if (node.nodeType === 3) {
            const frag = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach((t) => {
              if (!t || /^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
              else { const s = document.createElement('span'); s.className = 'word'; s.textContent = t; frag.appendChild(s); }
            });
            node.parentNode.replaceChild(frag, node);
          } else Array.from(node.childNodes).forEach(wrap);
        };
        wrap(st);
      }
      gsap.fromTo(st.querySelectorAll('.word'), { opacity: 0.16 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });
      gsap.fromTo('#aboutImg', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.about-figure', start: 'top bottom', end: 'bottom top', scrub: true } });
      qa('.count').forEach((c) => {
        const to = +c.dataset.to, o = { v: 0 };
        ScrollTrigger.create({ trigger: c, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: () => (c.textContent = Math.round(o.v)) }) });
      });

      /* ---- climb: pinned scroll-scrubbed video ---- */
      let cv = q('#climbVideo'); const steps = qa('.step'), dots = qa('.step-dots i');
      const fill = q('#meterFill'), read = q('#meterRead');
      let target = 0, cur = 0, lastStep = 0, raf;
      ScrollTrigger.create({ trigger: '#climb', start: 'top top', end: () => (innerWidth < 640 ? '+=220%' : '+=320%'), invalidateOnRefresh: true, pin: true, scrub: true, anticipatePin: 1, onUpdate: (self) => (target = self.progress) });
      cv.pause();
      // start downloading the full climb film only when the visitor gets close to it
      ScrollTrigger.create({ trigger: '#climb', start: 'top bottom+=120%', once: true, onEnter: () => { const v = q('#climbVideo'); v.preload = 'auto'; v.load(); } });
      const scrub = () => {
        raf = requestAnimationFrame(scrub);
        cur += (target - cur) * 0.1;
        fill.style.height = cur * 100 + '%';
        read.style.bottom = cur * 100 + '%';
        const idx = Math.min(steps.length - 1, Math.floor(cur * steps.length * 1.0001));
        if (idx !== lastStep) { read.textContent = `Step ${idx + 1} of ${steps.length}`; steps.forEach((s, i) => s.classList.toggle('on', i === idx)); dots.forEach((d, i) => d.classList.toggle('on', i <= idx)); lastStep = idx; }
        if (!cv.isConnected) { cv = q('#climbVideo'); cv.pause(); }
        if (cv.readyState >= 2 && cv.duration) {
          const t = cur * (cv.duration - 0.05);
          if (Math.abs(cv.currentTime - t) > 0.03 && !cv.seeking) cv.currentTime = t;
        }
      };
      scrub();
      const prime = () => { const p = cv.play(); if (p && p.then) p.then(() => cv.pause()).catch(() => {}); };
      addEventListener('touchstart', prime, { once: true, passive: true });
      cleanups.push(() => { cancelAnimationFrame(raf); removeEventListener('touchstart', prime); });

      /* ---- tree care: film opens up ---- */
      gsap.fromTo('#careFilm', { clipPath: 'inset(8% 6% 8% 6% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '#careFilm', start: 'top 85%', end: 'top 15%', scrub: true } });
      gsap.fromTo('#careFilm video', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#careFilm', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* ---- equipment: horizontal track on desktop ---- */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const track = q('#equipTrack');
        const dist = () => track.scrollWidth - innerWidth;
        const tw = gsap.to(track, { x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: '#equipment', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
        qa('.ecard').forEach((card) => gsap.from(card, { y: 80, rotate: 4, opacity: 0.3, ease: 'power2.out',
          scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left 95%', end: 'left 45%', scrub: true } }));
      });
      cleanups.push(() => mm.revert());

      /* ---- why, footer ---- */
      gsap.fromTo('#finalBg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      gsap.from('#wordmark span', { yPercent: 100, ease: 'expo.out', duration: 1.4, stagger: 0.07, scrollTrigger: { trigger: '#wordmark', start: 'top 95%' } });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    addEventListener('load', refresh);
    const t = setTimeout(refresh, 600);
    // never leave the loader up
    const safety = setTimeout(() => { if (!session.introPlayed) { session.introPlayed = true; setShowLoader(false); gsap.set('#heroTitle .w > span', { yPercent: 0 }); gsap.set('.hero-fade, .hero .eyebrow', { opacity: 1, y: 0 }); if (lenis) lenis.start(); } }, 6000);

    return () => { cleanups.forEach((f) => f()); ctx.revert(); removeEventListener('load', refresh); clearTimeout(t); clearTimeout(safety); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={root}>
      {showLoader && (
        <div className="loader" id="loader" aria-hidden="true">
          <div className="loader-inner">
            <div className="loader-mark">
              <img src={media('mark-cream.png')} alt="" />
              <img className="fillmark" src={media('mark-cream.png')} alt="" id="loaderFill" />
            </div>
          </div>
        </div>
      )}
      <main id="top">
        <Hero onPlay={openVideo} />
        <Ticker />
        <About />
        <Climb />
        <Services />
        <TreeCare />
        <Equipment />
        <Why />
        <Pricing />
        <Voices />
        <Team />
        <Follow />
        <Faq />
      </main>
      <Footer />
      <VideoModal open={video} onClose={closeVideo} />
    </div>
  );
}
