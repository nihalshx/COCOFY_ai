// All editable site content lives here. Change text, links or people in this one file.

const BASE = import.meta.env.BASE_URL;
// eslint-disable-next-line no-undef
const HASH = typeof __MEDIA_HASH__ !== 'undefined' ? __MEDIA_HASH__ : {};
// Adds ?v=<fingerprint> so browsers fetch a fresh copy whenever a file changes.
export const media = (file) => `${BASE}media/${file}${HASH[file] ? `?v=${HASH[file]}` : ''}`;

const WA_NUMBER = '917012692564';
export const wa = (text) =>
  `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const contact = {
  phones: [
    { label: '+91 70126 92564', tel: '+917012692564' },
    { label: '+91 73564 92564', tel: '+917356492564' }
  ],
  email: 'contact@cocofy.in',
  address: ['Padne (Padanna), Hosdurg Taluk,', 'Kasaragod District, Kerala'],
  hours: '07:00 AM to 07:00 PM',
  openHour: 7,      // 7 AM, India time
  closeHour: 19,    // 7 PM
  bookText: "Hi Cocofy, I'd like to book a coconut harvest."
};

export const socials = {
  instagram: { url: 'https://www.instagram.com/cocofy.in/', handle: '@cocofy.in' },
  youtube: { url: 'https://youtube.com/@cocofyin', handle: '@cocofyin' },
  facebook: { url: 'https://www.facebook.com/profile.php?id=61579209525297', handle: 'Cocofy' }
};

// "How we work" film from the old site's hero popup
export const youtubeId = 'UvoeQGi0mLQ';

// Videos (public/media). Each loop ships in 4 files: NAME.av1.mp4 + NAME.mp4 (1080p) and
// NAME-sm.av1.mp4 + NAME-sm.mp4 (720p for tablets/phones). Browsers pick AV1 when they support it.
// When a 9:16 phone version is ready, add e.g. hero-mobile.mp4 and set heroMobile: 'hero-mobile'.
export const videos = {
  hero: 'hero',
  heroMobile: null,
  climb: 'climb',          // scroll-scrubbed: H.264 only (see README encode settings)
  climbMobile: null,
  machine: 'machine',
  care: 'care',
  dusk: 'dusk'
};

// Founders' social links: paste each profile URL. Empty ones are hidden automatically.
export const team = [
  { name: 'Aslam', role: 'CEO & Founder', photo: 'team-aslam.webp',
    links: { instagram: '', linkedin: '', facebook: '' } },
  { name: 'Shaheen M.K', role: 'CEO & Founder', photo: 'team-shaheen.webp',
    links: { instagram: '', linkedin: '', facebook: '' } },
  { name: 'Aneesa', role: 'CFO', photo: 'team-aneesa.webp',
    links: { instagram: '', linkedin: '', facebook: '' } }
];

export const stats = [
  { to: 150, suffix: '+', label: 'Harvesting projects completed' },
  { to: 120, suffix: '+', label: 'Happy clients across Kerala' },
  { value: '7–7', label: 'Working hours, 7 AM to 7 PM' }
];

export const steps = [
  { title: 'Service request', text: 'Call or WhatsApp Cocofy to request coconut harvesting or tree care.' },
  { title: 'Schedule the visit', text: 'We confirm a date based on your location and the condition of your trees.' },
  { title: 'Harvesting & tree care', text: 'Our trained team climbs with modern equipment and harvests safely, using proper methods.' },
  { title: 'Final result', text: 'The work is finished cleanly and safely, with your trees healthy and the ground cleared.' }
];

export const services = [
  { tag: 'Harvest', title: 'Coconut harvesting', text: 'Professional harvesting at scheduled intervals, timed for the best yield from every palm.',
    img: 'climber-wide.webp', wa: "Hi Cocofy, I'm interested in coconut harvesting." },
  { tag: 'Care', title: 'Tree maintenance & care', text: 'Inspection, pruning, pest advice, tree medicine and basic protective care for healthier trees.',
    img: 'care-poster.jpg', wa: "Hi Cocofy, I'm interested in tree maintenance and care." },
  { tag: 'Consult', title: 'Plantation consultation', text: 'We study your farm and plan productivity improvements and safe harvesting cycles.',
    img: 'grove.webp', wa: "Hi Cocofy, I'd like a plantation consultation." }
];

export const careItems = [
  { tag: 'Check', title: 'Tree health check', text: 'We look over the crown, trunk and base of each palm and tell you what we find.' },
  { tag: 'Clean', title: 'Pruning & cleaning', text: 'Dry fronds and old bunches come down safely, so the crown stays clean and productive.' },
  { tag: 'Protect', title: 'Pest advice', text: 'Practical advice on common coconut pests, before they cut into your yield.' },
  { tag: 'Treat', title: 'Tree medicine', text: 'Treatment support, including Trichoderma bio-fungicide that protects roots from fungal disease.' }
];

export const equipment = [
  { tag: 'Climbing', meta: 'Steel frame', title: 'Coconut tree climbing machine', img: 'p-climber.webp', light: true,
    text: 'A foot-operated steel climber that clamps the trunk for a steady, controlled ascent on tall palms.' },
  { tag: 'Tree care', meta: 'Bio-fungicide', title: 'Tree care & treatment', img: 'p-tyson.webp', light: false,
    text: 'Trichoderma-based bio treatments that protect roots and help prevent fungal disease in coconut palms.' },
  { tag: 'Processing', meta: 'Motorised', title: 'Coconut husk remover', img: 'p-husker.webp', light: false,
    text: 'A motorised dehusker that strips husk quickly and cleanly after harvest, ready for sale or use.' }
];

export const why = [
  { icon: 'tools', title: 'Professional equipment', text: 'Modern climbing machines and tools make every harvest safe and efficient.' },
  { icon: 'team', title: 'Experienced team', text: 'Hands-on experience harvesting and caring for coconut trees in every kind of condition.' },
  { icon: 'rupee', title: 'Fair, transparent pricing', text: 'Clear prices with no hidden charges, for homeowners and plantation owners alike.' },
  { icon: 'shield', title: 'Trained professionals', text: 'Skilled workers trained to handle coconut trees safely, responsibly and efficiently.' }
];

export const plans = [
  { tag: 'For regular needs', title: 'Basic harvesting', text: 'Suitable for regular coconut harvesting at home.',
    items: ['Coconut harvesting', 'Safe climbing with equipment', 'Clean completion'],
    cta: 'Request quote', wa: 'Hi Cocofy, please send a quote for the Basic Harvesting plan.' },
  { tag: 'For homes & farms', title: 'Regular harvesting & care', text: 'Harvesting with basic tree care for homes and farms.', feature: true,
    items: ['Coconut harvesting', 'Basic tree inspection', 'Care recommendations', 'Safe and clean work'],
    cta: 'Request quote', wa: 'Hi Cocofy, please send a quote for the Regular Harvesting & Care plan.' },
  { tag: 'For plantations', title: 'Complete tree care', text: 'Long-term coconut management for plantations.',
    items: ['Coconut harvesting', 'Tree health check', 'Treatment support', 'Scheduled service option'],
    cta: 'Talk to us', wa: "Hi Cocofy, I'd like to discuss the Complete Tree Care plan." }
];

export const reviews = [
  ['Sudheer', 'Cocofy did the coconut harvesting safely using proper climbing equipment. The work was completed on time and the trees were not damaged.'],
  ['Naseer P', "Very professional team. They explained the condition of my trees and handled both harvesting and basic care properly. I'm satisfied with the service."],
  ['Rajesh M', 'Earlier we had difficulty finding skilled climbers. Cocofy solved that problem. Reliable service and fair pricing.'],
  ['Abdul Rahman', 'The climbers were experienced and careful. Even tall trees were harvested without any risk. I will definitely use Cocofy again.'],
  ['Sajith K', 'Good communication, safe work, and clean execution. Cocofy makes coconut harvesting stress-free.']
];

export const faqs = [
  { q: 'Which areas do you serve?', a: 'We are based in Padanna, Kasaragod, and serve homes, farms and plantations across Kerala. Send us your location and we will confirm a visit date.' },
  { q: 'How do I book a harvest?', a: 'Call or WhatsApp +91 70126 92564 with your location and the number of trees. We confirm the date based on your location and the condition of your trees.' },
  { q: 'How much does it cost?', a: 'It depends on the number of trees, their height, your location and the plan you choose. We give you a clear price before we start, with no hidden charges.' },
  { q: 'Will machine climbing damage my trees?', a: 'No. Our trained climbers use mechanical climbing machines and proper methods to harvest without damaging the tree or the property around it.' },
  { q: 'Can you treat an unhealthy tree?', a: 'Yes. We run health checks, basic maintenance and treatment support, including bio treatments such as Trichoderma, to stop common problems that reduce yield.' },
  { q: 'Can you come back on a schedule?', a: 'Yes. Harvesting at scheduled intervals is part of our service, and the Complete Tree Care plan includes a scheduled service option.' },
  { q: 'What are your working hours?', a: 'We work from 7:00 AM to 7:00 PM.' }
];

export const careersText = "Hi Cocofy, I'd like to work with Cocofy as a climber.";
