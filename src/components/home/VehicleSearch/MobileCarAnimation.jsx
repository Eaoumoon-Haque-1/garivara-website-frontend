import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";

function Wheel({ cx }) {
  const reduceMotion = useReducedMotion();

  return (
    <g>
      {!reduceMotion && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} 66`}
          to={`360 ${cx} 66`}
          dur="0.55s"
          repeatCount="indefinite"
        />
      )}
      <circle cx={cx} cy="66" r="16" fill="#0f172a" />
      <circle
        cx={cx}
        cy="66"
        r="10"
        fill="#334155"
        stroke="#64748b"
        strokeWidth="2"
      />
      {[0, 120, 240].map((angle) => (
        <line
          key={angle}
          x1={cx}
          y1="63"
          x2={cx}
          y2="57.5"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${angle} ${cx} 66)`}
        />
      ))}
      <circle cx={cx} cy="66" r="3" fill="#10b981" />
      <circle cx={cx} cy="57.5" r="1.8" fill="#fbbf24" />
    </g>
  );
}
function CarArtwork() {
  return (
    <svg viewBox="0 0 224 90" className="h-auto w-full drop-shadow-lg">
      <defs>
        <linearGradient id="car-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="0.55" stopColor="#059669" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="car-window" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#dbeafe" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
      </defs>

      <path
        d="M18 58c2-10 10-17 24-19l27-24c6-5 13-7 22-7h43c12 0 20 4 27 13l15 18h19c11 0 19 7 21 17l1 9h-22c-1-13-10-22-24-22s-23 9-24 22H84c-1-13-10-22-24-22s-23 9-24 22H18c-4 0-7-3-7-7 0-3 3-6 7-6Z"
        fill="url(#car-body)"
        stroke="#065f46"
        strokeWidth="2"
      />
      <path
        d="m76 17-23 21h52V15H91c-6 0-11 1-15 2Z"
        fill="url(#car-window)"
        stroke="#d1fae5"
        strokeWidth="1.5"
      />
      <path
        d="M112 15v23h53l-11-14c-5-6-11-9-20-9h-22Z"
        fill="url(#car-window)"
        stroke="#d1fae5"
        strokeWidth="1.5"
      />
      <path
        d="M108 16v48M167 39l8 25"
        stroke="#065f46"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M121 45h13"
        stroke="#d1fae5"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="187" y="46" width="18" height="8" rx="4" fill="#fef3c7" />
      <rect x="14" y="47" width="8" height="8" rx="3" fill="#fb7185" />
      <path
        d="M22 58h17M82 58h48M193 58h22"
        stroke="#6ee7b7"
        strokeWidth="2"
        opacity="0.8"
      />
      <text
        x="117"
        y="58"
        fill="#ecfdf5"
        fontSize="12"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        GV
      </text>

      <Wheel cx="60" />
      <Wheel cx="171" />
    </svg>
  );
}

function MobileCarAnimation() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
    <div
      className="relative h-24 overflow-hidden border-b border-emerald-100 bg-gradient-to-b from-sky-50 via-white to-emerald-50 sm:hidden"
      aria-hidden="true"
    >
      <div className="absolute left-6 top-3 size-8 rounded-full bg-amber-200/70 blur-sm" />
      <div className="absolute left-14 top-5 h-px w-24 bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
      <div className="absolute right-6 top-4 h-px w-20 bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

      <m.div
        className="absolute inset-x-0 bottom-2 h-1.5 bg-[repeating-linear-gradient(90deg,#94a3b8_0_24px,transparent_24px_48px)] opacity-55"
        animate={
          reduceMotion
            ? undefined
            : { backgroundPositionX: ["0px", "-48px"] }
        }
        transition={{ duration: 0.55, ease: "linear", repeat: Infinity }}
      />

      <m.div
        className="absolute bottom-3 left-0 w-36"
        initial={reduceMotion ? false : { x: "-120%" }}
        animate={{
          x: reduceMotion ? "calc(50vw - 5.5rem)" : "calc(100vw + 2rem)",
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 5.6,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 0.8,
              }
        }
      >
        {!reduceMotion && (
          <m.div
            className="absolute -left-10 top-9 grid gap-2"
            animate={{ opacity: [0.15, 0.65, 0.15], x: [5, -5, 5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <span className="block h-0.5 w-10 rounded-full bg-emerald-400/70" />
            <span className="ml-3 block h-0.5 w-7 rounded-full bg-sky-400/60" />
          </m.div>
        )}
        <m.div
          animate={reduceMotion ? undefined : { y: [0, -1.2, 0] }}
          transition={{
            duration: 0.55,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <CarArtwork />
        </m.div>
        <m.div
          className="absolute bottom-0 left-7 h-2 w-28 rounded-full bg-slate-900/20 blur-[3px]"
          animate={
            reduceMotion
              ? undefined
              : {
                  scaleX: [1, 0.9, 1],
                  opacity: [0.24, 0.15, 0.24],
                }
          }
          transition={{ duration: 0.55, repeat: Infinity }}
        />
      </m.div>
    </div>
    </LazyMotion>
  );
}

export default MobileCarAnimation;