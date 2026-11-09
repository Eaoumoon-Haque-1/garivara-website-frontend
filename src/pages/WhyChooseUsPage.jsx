import {
  ArrowRight,
  BadgeDollarSign,
  CarFront,
  Check,
  Clock3,
  Headphones,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/shared/Button/Button";

const benefits = [
  {
    title: "A vehicle for every plan",
    description:
      "From everyday city rides to longer family journeys, choose a clean and comfortable vehicle that fits the occasion.",
    Icon: CarFront,
    className: "sm:col-span-2 lg:col-span-2",
  },
  {
    title: "Pricing without surprises",
    description:
      "Review clear journey details before confirming, with straightforward rates and no hidden surprises.",
    Icon: BadgeDollarSign,
    className: "lg:col-span-1",
  },
  {
    title: "Safety comes first",
    description:
      "Verified drivers and regularly inspected vehicles help make every journey dependable and secure.",
    Icon: ShieldCheck,
    className: "lg:col-span-1",
  },
  {
    title: "Support throughout the ride",
    description:
      "Get responsive assistance before, during, and after your journey whenever you need a helping hand.",
    Icon: Headphones,
    className: "sm:col-span-2 lg:col-span-2",
  },
];

const trustPoints = [
  "Verified drivers",
  "Clear journey pricing",
  "Comfortable vehicles",
  "Responsive support",
];

const journeyStandards = [
  {
    title: "Before you book",
    description:
      "Compare suitable ride options and understand the journey details clearly.",
    Icon: MapPinned,
  },
  {
    title: "Before you travel",
    description:
      "Your booking is confirmed with the information you need for a smooth pickup.",
    Icon: Clock3,
  },
  {
    title: "While you are on the road",
    description:
      "Travel in a comfortable vehicle with dependable service and support nearby.",
    Icon: ShieldCheck,
  },
];

function BenefitCard({ benefit, index }) {
  const { title, description, Icon, className } = benefit;

  return (
    <article
      className={`group relative min-h-64 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_28px_70px_-38px_rgba(15,23,42,0.35)] motion-reduce:transform-none ${className}`}
    >
      <span className="absolute right-5 top-3 text-7xl font-black tracking-[-0.08em] text-slate-50 transition-colors group-hover:text-emerald-50">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/70">
        <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div className="relative mt-14 max-w-lg">
        <h3 className="text-xl font-bold tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="absolute inset-x-6 bottom-0 h-1 origin-left scale-x-0 rounded-full bg-emerald-700 transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
    </article>
  );
}

function WhyChooseUsPage() {
  return (
    <main className="overflow-hidden bg-[#f7f9f7]">
      <section className="relative isolate bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-28 -top-28 size-[32rem] rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="absolute -bottom-36 left-1/4 size-96 rounded-full bg-emerald-900/50 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="mx-auto grid min-h-[38rem] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              <Sparkles className="size-4" aria-hidden="true" />
              Why Gari Vara
            </p>
            <h1 className="mt-7 text-[clamp(2.6rem,8vw,5.3rem)] font-black leading-[0.98] tracking-[-0.055em]">
              Better journeys begin with
              <span className="block text-emerald-400">better standards.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              We bring vehicle choice, clear pricing, trusted safety, and responsive support together in one straightforward travel experience.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} className="min-h-12 px-6" to="/car">
                Find your ride
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                href="#our-standards"
              >
                Explore our standards
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {trustPoints.map((item) => (
              <div
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm"
                key={item}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-400 text-slate-950">
                  <Check
                    className="size-5"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="font-semibold text-slate-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Built around you
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                The details that make a ride feel effortless
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">
              A dependable journey is more than getting from one place to another. It is knowing what to expect at every step and having support when it matters.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.title}
                benefit={benefit}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="our-standards" className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Our service standard
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Confidence at every stage of your journey
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              From the moment you start searching until you reach your destination, the experience is designed to stay simple, clear, and dependable.
            </p>
          </div>

          <ol className="relative grid gap-5">
            <div
              className="absolute bottom-12 left-7 top-12 w-px bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-100"
              aria-hidden="true"
            />
            {journeyStandards.map(({ title, description, Icon }, index) => (
              <li
                className="relative grid grid-cols-[3.5rem_1fr] gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
                key={title}
              >
                <span className="relative z-10 grid size-14 place-items-center rounded-2xl bg-slate-950 text-emerald-400 shadow-lg">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div className="pt-1">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Stage {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-emerald-800 px-6 py-12 text-white shadow-[0_30px_80px_-35px_rgba(6,78,45,0.65)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14">
          <div
            className="absolute -right-20 -top-32 size-80 rounded-full border-[48px] border-white/5"
            aria-hidden="true"
          />
          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
              Ready when you are
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Your next journey deserves a better start.
            </h2>
            <p className="mt-4 text-base leading-7 text-emerald-100/80">
              Search available options and choose the ride that feels right for you.
            </p>
          </div>
          <Button
            as={Link}
            className="relative mt-8 shrink-0 bg-white text-emerald-800 hover:bg-emerald-50 lg:mt-0"
            to="/car"
          >
            Search for a ride
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </main>
  );
}

export default WhyChooseUsPage;