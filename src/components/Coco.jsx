/* Coco: Cocofy's mascot, a cheerful green tender coconut (karikku) with a leaf sprout.
   mood: 'idle' | 'happy' | 'think' | 'talk' | 'wave'
   All expressions are drawn once and switched with CSS, so changes animate smoothly. */
let n = 0;
export default function Coco({ mood = 'idle', size = 76, className = '', badge = false }) {
  const k = `c${(n++).toString(36)}`; // unique gradient ids per instance
  return (
    <span className={`coco2 coco--${mood}${badge ? ' coco2--badge' : ''} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 128" width="100%" height="100%">
        <defs>
          <radialGradient id={`${k}b`} cx="38%" cy="34%" r="75%">
            <stop offset="0" stopColor="#B5E07A" />
            <stop offset=".45" stopColor="#6DB547" />
            <stop offset="1" stopColor="#2F7A34" />
          </radialGradient>
          <linearGradient id={`${k}l`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#3E9A3E" />
            <stop offset="1" stopColor="#8FD36A" />
          </linearGradient>
          <radialGradient id={`${k}c`} cx="50%" cy="40%" r="70%">
            <stop offset="0" stopColor="#B08A4A" />
            <stop offset="1" stopColor="#7A5A2B" />
          </radialGradient>
        </defs>

        <ellipse className="c2-shadow" cx="60" cy="121" rx="30" ry="4.5" fill="rgba(0,0,0,.22)" />

        <g className="c2-all">
          {/* feet */}
          <ellipse cx="47" cy="114" rx="9.5" ry="5.5" fill="#2E6E2E" stroke="#1D4A22" strokeWidth="2" />
          <ellipse cx="73" cy="114" rx="9.5" ry="5.5" fill="#2E6E2E" stroke="#1D4A22" strokeWidth="2" />

          {/* arms */}
          <path className="c2-armL" d="M22 78 Q11 82 12.5 93" stroke="#1D4A22" strokeWidth="9.5" strokeLinecap="round" fill="none" />
          <path className="c2-armL" d="M22 78 Q11 82 12.5 93" stroke="#4F9E3E" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <g className="c2-armR">
            <path d="M98 78 Q109 82 107.5 93" stroke="#1D4A22" strokeWidth="9.5" strokeLinecap="round" fill="none" />
            <path d="M98 78 Q109 82 107.5 93" stroke="#4F9E3E" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          </g>

          {/* body */}
          <g className="c2-body">
            <path d="M60 23 C89 23 103 47 103 73 C103 99 85 115 60 115 C35 115 17 99 17 73 C17 47 31 23 60 23 Z"
              fill={`url(#${k}b)`} stroke="#1D4A22" strokeWidth="2.6" />
            {/* soft lower shade + gloss */}
            <path d="M24 88 C32 106 48 112 60 112 C76 112 92 104 98 86 C88 100 74 106 60 106 C44 106 31 99 24 88 Z" fill="#1F5E26" opacity=".22" />
            <path d="M31 56 C33 43 42 34 53 30" stroke="#F4FFE6" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55" />
            <circle cx="29" cy="65" r="2.6" fill="#F4FFE6" opacity=".55" />

            {/* coconut ridges */}
            <g stroke="#1F5E26" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".14">
              <path d="M44 33 C34 52 33 84 42 106" /><path d="M76 33 C86 52 87 84 78 106" />
            </g>
            {/* three-pointed calyx cap */}
            <path d="M60 15.5 Q63.5 22 70 23.5 Q79 25 81 32 Q72 29.5 66 31.5 Q63 35.5 60 35.5 Q57 35.5 54 31.5 Q48 29.5 39 32 Q41 25 50 23.5 Q56.5 22 60 15.5 Z"
              fill={`url(#${k}c)`} stroke="#1D4A22" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M55 25 Q60 27 65 25" stroke="#D1AE6E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".8" />

            {/* leaf sprout */}
            <g className="c2-leaf">
              <path d="M60 17 Q60 10 63 5" stroke="#1D4A22" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M62.5 7 Q75 -2 88 5 Q76 15 62.5 7 Z" fill={`url(#${k}l)`} stroke="#1D4A22" strokeWidth="2" strokeLinejoin="round" />
              <path d="M65 7 Q75 4 84 5.5" stroke="#CFF0A8" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".8" />
              <path d="M60.5 10 Q50 2 40 7 Q50 15 60.5 10 Z" fill={`url(#${k}l)`} stroke="#1D4A22" strokeWidth="2" strokeLinejoin="round" />
            </g>

            {/* cheeks */}
            <ellipse className="c2-cheek" cx="35" cy="83" rx="7" ry="4.2" fill="#FF8A78" opacity=".6" />
            <ellipse className="c2-cheek" cx="85" cy="83" rx="7" ry="4.2" fill="#FF8A78" opacity=".6" />

            {/* eyes: open */}
            <g className="c2-eyes">
              <g className="c2-look">
                <ellipse cx="45" cy="71" rx="7.4" ry="9.4" fill="#1B140F" />
                <ellipse cx="75" cy="71" rx="7.4" ry="9.4" fill="#1B140F" />
                <circle cx="47.6" cy="67" r="3.1" fill="#fff" />
                <circle cx="77.6" cy="67" r="3.1" fill="#fff" />
                <circle cx="42.8" cy="75.4" r="1.5" fill="#fff" opacity=".9" />
                <circle cx="72.8" cy="75.4" r="1.5" fill="#fff" opacity=".9" />
              </g>
            </g>
            {/* eyes: happy ^^ */}
            <g className="c2-eyes-happy" stroke="#1B140F" strokeWidth="3.6" strokeLinecap="round" fill="none">
              <path d="M38.5 73 Q45 64 51.5 73" /><path d="M68.5 73 Q75 64 81.5 73" />
            </g>

            {/* mouths */}
            <path className="c2-m-smile" d="M54 84.5 Q60 90.5 66 84.5" stroke="#1B140F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <g className="c2-m-open">
              <path d="M52.5 83.5 Q60 95 67.5 83.5 Q60 86 52.5 83.5 Z" fill="#5A1E14" stroke="#1B140F" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M56 89.5 Q60 92.5 64 89.5 Q60 88 56 89.5 Z" fill="#FF7B6B" />
            </g>
            <ellipse className="c2-m-o" cx="61" cy="87" rx="3" ry="3.4" fill="#5A1E14" stroke="#1B140F" strokeWidth="1.8" />
          </g>

          {/* thinking dots */}
          <g className="c2-think">
            <circle cx="98" cy="30" r="3.2" fill="#F3EBD8" /><circle cx="106" cy="21" r="4.2" fill="#F3EBD8" /><circle cx="114" cy="10" r="5.2" fill="#F3EBD8" />
          </g>
          {/* sparkles for happy */}
          <g className="c2-spark" fill="#F0B54A">
            <path d="M14 34 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
            <path d="M104 46 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4z" />
          </g>
        </g>
      </svg>
    </span>
  );
}
