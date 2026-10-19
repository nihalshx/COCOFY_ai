// Coco's answers. Everything here comes from site.js, so the assistant never says
// anything the website doesn't. No AI service or API key is used.
import { careItems, contact, equipment, faqs, plans, services, socials, team, wa, careersText } from './site.js';

const faq = (start) => faqs.find((f) => f.q.toLowerCase().startsWith(start)).a;

export const QUICK = [
  { label: 'Book a harvest', send: 'book' },
  { label: 'Services', send: 'What services do you offer?' },
  { label: 'Prices', send: 'How much does it cost?' },
  { label: 'Tree care', send: 'My tree looks unhealthy' },
  { label: 'Areas', send: 'Which areas do you serve?' },
  { label: 'Hours', send: 'What are your working hours?' }
];

// action types: { type:'go', id, label } scrolls to a section; { type:'link', href, label } opens a link;
// { type:'say', text, label } sends a chip; { type:'book' } starts the booking flow
const goWA = (label = 'Chat on WhatsApp', text = contact.bookText) => ({ type: 'link', href: wa(text), label, wa: true });
const call = () => ({ type: 'link', href: `tel:${contact.phones[0].tel}`, label: `Call ${contact.phones[0].label}` });

const INTENTS = [
  { id: 'greet', words: ['hi', 'hello', 'hey', 'hai', 'namaskaram', 'namaste', 'good morning', 'good evening', 'yo'],
    reply: () => ({ text: "Namaskaram! I'm Coco from Cocofy. I can tell you about our coconut harvesting and tree care, or help you book a visit. What would you like to know?", chips: QUICK }) },

  { id: 'book', words: ['book', 'booking', 'appointment', 'schedule a', 'hire', 'need a climber', 'need climber', 'visit my', 'want harvest', 'can you come', 'reserve'],
    reply: () => ({ start: 'book' }) },

  { id: 'services', words: ['service', 'services', 'what do you do', 'offer', 'provide', 'work do you'],
    reply: () => ({
      text: `We offer three services:\n${services.map((s) => `• ${s.title}: ${s.text}`).join('\n')}`,
      actions: [{ type: 'go', id: '#services', label: 'See services' }, { type: 'book' }]
    }) },

  { id: 'harvest', words: ['harvest', 'harvesting', 'pluck', 'plucking', 'climb', 'climber', 'climbing', 'thenga', 'thengu', 'coconut picking', 'pick coconut', 'tender', 'kayattam'],
    reply: () => ({
      text: `Our trained climbers use modern climbing machines, so the harvest is safe and doesn't damage your trees or property. ${services[0].text} We can come once or on a regular schedule.`,
      actions: [{ type: 'book' }, { type: 'go', id: '#climb', label: 'How it works' }]
    }) },

  { id: 'care', words: ['care', 'disease', 'sick', 'unhealthy', 'pest', 'insect', 'fungus', 'fungal', 'rot', 'yellow', 'dry', 'dying', 'treatment', 'treat', 'medicine', 'prune', 'pruning', 'clean', 'cleaning', 'health', 'yield', 'trichoderma', 'tyson', 'root'],
    reply: () => ({
      text: `For tree care we do:\n${careItems.map((c) => `• ${c.title}: ${c.text}`).join('\n')}\n\nTell the team what you're seeing on WhatsApp, with a photo if you can, and they'll advise you.`,
      actions: [goWA('Ask about my tree', "Hi Cocofy, I'd like advice about my coconut tree."), { type: 'go', id: '#care', label: 'Tree care' }]
    }) },

  { id: 'price', words: ['price', 'prices', 'cost', 'rate', 'rates', 'charge', 'charges', 'how much', 'fee', 'fees', 'budget', 'vila', 'paisa', 'rupees', 'rs', 'quote', 'quotation', 'cheap', 'expensive'],
    reply: () => ({
      text: `${faq('how much')}\n\nPlans: ${plans.map((p) => p.title).join(', ')}.`,
      actions: [goWA('Get a quote', 'Hi Cocofy, could you send me a quote? Number of trees: , Location: '), { type: 'go', id: '#pricing', label: 'See plans' }]
    }) },

  { id: 'plans', words: ['plan', 'plans', 'package', 'packages', 'basic', 'regular', 'complete', 'subscription'],
    reply: () => ({
      text: plans.map((p) => `• ${p.title} (${p.tag.toLowerCase()}): ${p.items.join(', ')}.`).join('\n'),
      actions: [{ type: 'go', id: '#pricing', label: 'Compare plans' }, ...plans.map((p) => goWA(p.title, p.wa)).slice(0, 1)]
    }) },

  { id: 'area', words: ['area', 'areas', 'where', 'location', 'located', 'serve', 'district', 'kasaragod', 'kannur', 'kozhikode', 'calicut', 'kochi', 'ernakulam', 'thrissur', 'kerala', 'padanna', 'padne', 'nileshwar', 'kanhangad', 'hosdurg', 'evide', 'near me', 'my place', 'come to'],
    reply: () => ({
      text: `${faq('which areas')}\n\nOur base: ${contact.address.join(' ')}`,
      actions: [goWA('Check my location', "Hi Cocofy, can you come to my location? I'm at: "), { type: 'link', href: 'https://www.google.com/maps/search/?api=1&query=Padanna%2C+Kasaragod%2C+Kerala', label: 'Open map' }]
    }) },

  { id: 'hours', words: ['hour', 'hours', 'time', 'timing', 'timings', 'open', 'close', 'closed', 'open now', 'opening', 'sunday', 'samayam', 'working hours'],
    reply: ({ status }) => ({
      text: `We work from 7:00 AM to 7:00 PM. ${status.open ? "We're open right now." : "We're closed right now, but you can send a WhatsApp message and the team will reply from 7 AM."}`,
      actions: [goWA(), call()]
    }) },

  { id: 'contact', words: ['contact', 'phone', 'number', 'call', 'mobile', 'email', 'mail', 'whatsapp', 'reach', 'talk', 'human', 'person', 'agent', 'someone', 'owner', 'manager'],
    reply: () => ({
      text: `You can reach the Cocofy team here:\n• Phone: ${contact.phones.map((p) => p.label).join(' / ')}\n• Email: ${contact.email}\n• Hours: 7 AM to 7 PM`,
      actions: [goWA(), call()]
    }) },

  { id: 'safety', words: ['safe', 'safety', 'damage', 'roof', 'risk', 'injury', 'accident', 'insurance', 'break', 'harm', 'tall tree', 'tall trees'],
    reply: () => ({ text: 'Yes. Our trained climbers use mechanical climbing machines and proper methods, so harvesting does not damage the tree or the property around it, even on tall trees.', actions: [{ type: 'go', id: '#equipment', label: 'See our equipment' }, { type: 'book' }] }) },

  { id: 'schedule', words: ['regular', 'monthly', 'every month', 'repeat', 'recurring', 'again', 'interval', 'schedule', 'routine', 'season'],
    reply: () => ({ text: faq('can you come back'), actions: [goWA('Set up regular visits', "Hi Cocofy, I'd like regular harvesting visits."), { type: 'go', id: '#pricing', label: 'See plans' }] }) },

  { id: 'equipment', words: ['machine', 'machines', 'equipment', 'tool', 'tools', 'device', 'husk', 'dehusk', 'dehusker', 'peel'],
    reply: () => ({
      text: `Equipment we use:\n${equipment.map((e) => `• ${e.title}: ${e.text}`).join('\n')}`,
      actions: [{ type: 'go', id: '#equipment', label: 'See equipment' }]
    }) },

  { id: 'consult', words: ['plantation', 'farm', 'estate', 'acre', 'acres', 'consult', 'consultation', 'large', 'many trees', 'productivity', 'advice'],
    reply: () => ({ text: `${services[2].text} For plantations, the Complete Tree Care plan adds health checks, treatment support and scheduled visits.`, actions: [goWA('Plan a consultation', services[2].wa), { type: 'go', id: '#pricing', label: 'See plans' }] }) },

  { id: 'team', words: ['team', 'founder', 'founders', 'ceo', 'who are you', 'who runs', 'aslam', 'shaheen', 'aneesa', 'company', 'cocofy'],
    reply: () => ({ text: `Cocofy is a coconut harvesting and tree care service from Padanna, Kasaragod. The team: ${team.map((t) => `${t.name} (${t.role})`).join(', ')}.`, actions: [{ type: 'go', id: '#team', label: 'Meet the team' }] }) },

  { id: 'careers', words: ['job', 'jobs', 'career', 'careers', 'vacancy', 'hiring', 'work for', 'join', 'become a climber'],
    reply: () => ({ text: "Want to work with Cocofy? Send the team a message on WhatsApp and tell them a little about yourself.", actions: [goWA('Ask about jobs', careersText)] }) },

  { id: 'social', words: ['instagram', 'insta', 'youtube', 'facebook', 'video', 'videos', 'social', 'follow'],
    reply: () => ({ text: 'Follow Cocofy for harvesting updates and tree care tips.', actions: [{ type: 'link', href: socials.instagram.url, label: 'Instagram' }, { type: 'link', href: socials.youtube.url, label: 'YouTube' }, { type: 'link', href: socials.facebook.url, label: 'Facebook' }] }) },

  { id: 'thanks', words: ['thanks', 'thank you', 'thank', 'nanni', 'great', 'super', 'ok', 'okay', 'cool', 'nice'],
    reply: () => ({ text: "You're welcome! Anything else I can help with?", chips: QUICK.slice(0, 4) }) },

  { id: 'bye', words: ['bye', 'goodbye', 'see you', 'later'],
    reply: () => ({ text: 'Bye for now! The team is one WhatsApp message away whenever you need a harvest.', actions: [goWA()] }) }
];

const norm = (s) => ` ${s.toLowerCase().replace(/[^a-z0-9ഀ-ൿ\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;

export function answer(input, ctx) {
  const t = norm(input);
  const trees = t.match(/ (\d{1,5}) (?:coconut )?(?:trees?|palms?|thengu|thengukal|maram) /);
  let best = null, bestScore = 0;
  for (const it of INTENTS) {
    let score = 0;
    for (const w of it.words) if (t.includes(` ${w} `) || (w.includes(' ') && t.includes(w))) score += w.includes(' ') ? 2 : 1;
    if (score > bestScore) { best = it; bestScore = score; }
  }
  if (trees && (!best || ['harvest', 'book', 'price', 'consult'].includes(best.id))) {
    return { start: 'book', trees: trees[1] };
  }
  if (best) return best.reply(ctx);
  return {
    text: "I'm not sure about that one. The Cocofy team can answer it properly on WhatsApp, or you can pick a topic below.",
    actions: [goWA('Ask the team', `Hi Cocofy, I have a question: ${input}`)],
    chips: QUICK
  };
}

/* ---- guided booking: builds a ready-to-send WhatsApp message ---- */
export const BOOK_STEPS = {
  service: { ask: 'Happy to help you book! What do you need?', chips: ['Coconut harvesting', 'Tree care', 'Harvesting + tree care', 'Plantation consultation'] },
  trees: { ask: 'About how many coconut trees?', chips: ['1 to 10', '11 to 25', '26 to 50', 'More than 50'], free: 'Or type a number' },
  place: { ask: 'Where are the trees? Your village or town is enough.', input: 'e.g. Nileshwar, Kasaragod' },
  when: { ask: 'When would suit you?', chips: ['As soon as possible', 'This week', 'Next week', "I'm flexible"] }
};
export const BOOK_ORDER = ['service', 'trees', 'place', 'when'];

export function bookingMessage(b) {
  return [
    'Hi Cocofy, I would like to book a visit.',
    `Service: ${b.service}`,
    `Number of trees: ${b.trees}`,
    `Location: ${b.place}`,
    `When: ${b.when}`
  ].join('\n');
}
