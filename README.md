# Cocofy website (React + Vite)

Cinematic one-page site for Cocofy, plus Privacy and Terms pages.
Stack: React 18, Vite 5, React Router, GSAP + ScrollTrigger, Lenis smooth scroll.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
```

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. On vercel.com: **Add New → Project → Import** the repo.
3. Vercel detects **Vite** automatically (build `npm run build`, output `dist`). Click **Deploy**.
4. Add the domain: **Project → Settings → Domains → cocofy.in**, then set the DNS records Vercel shows at your domain registrar.

Without GitHub: run `npx vercel` inside this folder and follow the prompts.

`vercel.json` already handles:
- the old WordPress links (`/about-us`, `/services`, `/contact-us`) redirecting to the right sections, so Google links keep working
- Privacy and Terms pages on refresh
- long cache headers for videos and images

## Editing content
Almost everything is in **`src/data/site.js`**: phone, email, address, socials, services, plans, reviews, FAQs and team.

**Founders' social links:** fill in `team[].links` with full profile URLs. Empty links are hidden.
```js
{ name: 'Aslam', ..., links: { instagram: 'https://www.instagram.com/HANDLE/', linkedin: '', facebook: '' } }
```

## Coco, the website assistant
Coco is the animated mascot in the bottom-right corner: a cute green tender coconut with a leaf sprout. It bobs, blinks and sways its leaf; hops and sparkles when happy, waves to greet, moves its mouth while answering and looks up with thought bubbles while thinking. It answers visitors' questions and walks them through booking, then hands the booking to WhatsApp as a ready-to-send message.
- It runs entirely in the browser: **no AI service, no API key, no running costs**.
- Its answers are in **`src/data/assistant.js`**. Each topic has trigger words (`words`) and a reply. Most replies read from `site.js`, so changing a service, plan or FAQ there updates Coco too.
- To teach Coco a new topic, copy one of the blocks in `INTENTS`, change the words and the reply.
- The mascot drawing and its expressions are in `src/components/Coco.jsx`; the chat window is `src/components/Assistant.jsx`.

## Videos (`public/media`)
Every looping video ships in four files, and the browser picks the best one:

| File | Used for |
|---|---|
| `NAME.av1.mp4` | 1080p AV1: sharpest per MB (Chrome, Edge, Firefox, Android, newer iPhones/Macs) |
| `NAME.mp4` | 1080p H.264: fallback for every other browser |
| `NAME-sm.av1.mp4`, `NAME-sm.mp4` | 720p for tablets, phones and data-saver mode |

Loops: `hero`, `machine`, `care`, `dusk`. The scroll-driven `climb` video is H.264 only (`climb.mp4`, `climb-sm.mp4`), encoded with a keyframe every 4 frames so scrubbing stays smooth.

All clips are cleaned up before encoding: Veo watermark removed, light denoise, contrast-adaptive sharpening and debanding (removes stepping in skies and dark gradients).

**Phone versions (9:16):** add `hero-mobile.mp4` / `climb-mobile.mp4` and set `videos.heroMobile: 'hero-mobile'` / `videos.climbMobile: 'climb-mobile'` in `site.js`.

### Encoding a new clip (ffmpeg)
```bash
PRE="hqdn3d=1.5:1.5:3:3,cas=0.35,deband"
# 1080p AV1 + H.264
ffmpeg -i in.mp4 -an -vf "$PRE,scale=1920:-2,format=yuv420p10le" -c:v libsvtav1 -preset 6 -crf 40 -svtav1-params tune=0:film-grain=8 -movflags +faststart NAME.av1.mp4
ffmpeg -i in.mp4 -an -vf "$PRE,scale=1920:-2,format=yuv420p" -c:v libx264 -preset slower -crf 25 -tune film -movflags +faststart NAME.mp4
# 720p versions: same commands with scale=1280:-2 and -sm in the file name
# scroll-scrubbed video: H.264 with a keyframe every 4 frames
ffmpeg -i in.mp4 -an -vf "$PRE,scale=1920:-2,fps=24,format=yuv420p" -c:v libx264 -preset slower -crf 24 -tune film -g 4 -bf 0 -movflags +faststart climb.mp4
```

## Structure
```
src/
  data/site.js          all content
  lib/motion.js         GSAP, ScrollTrigger, Lenis setup
  components/Chrome.jsx nav, cursor, WhatsApp button, video popup
  components/Sections.jsx every home-page section + footer
  pages/Home.jsx        page + all scroll animations
  pages/Legal.jsx       Privacy policy and Terms
  styles.css            design tokens and styles
```
