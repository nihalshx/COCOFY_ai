const s = { 'aria-hidden': true };

export const Arrow = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...s}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" {...s}><path d="m5 12 5 5 9-10" /></svg>
);
export const Play = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...s}><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
);
export const Close = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...s}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...s}><path d="M12 5v14M5 12h14" /></svg>
);
export const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...s}><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4L2.8 9.5l6.4-.8L12 2.8Z" /></svg>
);
export const WhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...s}><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
);
export const Instagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...s}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);
export const Facebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...s}><path d="M14 8.5V6.8c0-.8.5-1 1-1h2V2.2h-2.8C11 2.2 10.3 4.4 10.3 6v2.5H8v3.6h2.3V22H14v-9.9h2.7l.4-3.6H14Z" /></svg>
);
export const YouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...s}><path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" /></svg>
);
export const LinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...s}><path d="M6.9 8.6H3.4V20h3.5V8.6ZM5.2 3a2 2 0 1 0 0 4.1 2 2 0 0 0 0-4.1ZM20.6 13.6c0-3.1-1.7-5.2-4.4-5.2-1.6 0-2.7.9-3.1 1.7V8.6H9.7V20h3.5v-5.7c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.5v-6.4Z" /></svg>
);

export const WhyIcon = ({ name }) => {
  const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, ...s };
  if (name === 'tools') return <svg {...p}><path d="M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8" /></svg>;
  if (name === 'team') return <svg {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5" /><circle cx="17.5" cy="9" r="2.4" /><path d="M16.5 14.6c2.3.2 4 1.9 4.5 4.6" /></svg>;
  if (name === 'rupee') return <svg {...p}><path d="M7 4h10M7 9h10M10 4c3.5 0 5 1.6 5 3.5S13.5 11 10 11H7l8 9" /></svg>;
  return <svg {...p}><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.8 12 2.2 2.2 4.4-4.4" /></svg>;
};
export const Phone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...s}><path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" /></svg>
);
