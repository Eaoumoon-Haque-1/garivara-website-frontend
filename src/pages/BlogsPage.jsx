import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CarFront,
  Clock3,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import appImage from "../assets/appBG.jpg.jpeg";
import cityRideImage from "../assets/slider_1.jpg.jpeg";
import roadTripImage from "../assets/slider2_bg.jpg.jpeg";

const blogPosts = [
  {
    category: "Travel guide",
    title: "A practical guide to planning a comfortable road trip",
    excerpt:
      "Simple decisions about timing, stops, luggage, and vehicle choice can make a long journey feel effortless.",
    date: "July 10, 2026",
    readTime: "6 min read",
    image: roadTripImage,
    Icon: MapPinned,
  },
  {
    category: "Car rental",
    title: "How to choose the right rental car for your journey",
    excerpt:
      "Match passenger count, luggage space, road conditions, and trip length with the vehicle that suits you best.",
    date: "July 4, 2026",
    readTime: "5 min read",
    image: cityRideImage,
    Icon: CarFront,
  },
  {
    category: "Safety",
    title: "Seven checks to make before starting a long drive",
    excerpt:
      "A short pre-trip check can help you travel with more confidence and avoid preventable delays.",
    date: "June 28, 2026",
    readTime: "4 min read",
    image: appImage,
    Icon: ShieldCheck,
  },
  {
    category: "Destinations",
    title: "Weekend road-trip ideas from Dhaka",
    excerpt:
      "Discover easy escapes for nature, history, and food when you only have a weekend to explore.",
    date: "June 19, 2026",
    readTime: "7 min read",
    image: roadTripImage,
    Icon: MapPinned,
  },
  {
    category: "Travel tips",
    title: "What to pack for a smooth family car journey",
    excerpt:
      "Keep everyone comfortable with a compact checklist for snacks, entertainment, documents, and essentials.",
    date: "June 12, 2026",
    readTime: "5 min read",
    image: cityRideImage,
    Icon: BookOpen,
  },
  {
    category: "Gari Vara app",
    title: "Keep every journey detail close at hand",
    excerpt:
      "See how a simple mobile booking flow helps you organize the important parts of your trip in one place.",
    date: "June 3, 2026",
    readTime: "3 min read",
    image: appImage,
    Icon: CarFront,
  },
];

const categories = [
  "All stories",
  "Travel guides",
  "Car rental",
  "Safety",
  "Destinations",
];

function ArticleCard({ post }) {
  const { category, title, excerpt, date, readTime, image, Icon } = post;

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_-38px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_65px_-36px_rgba(15,23,42,0.32)] motion-reduce:transform-none">
      <div className="relative aspect-[16/10] overflow-hidden bg-emerald-50">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
          src={image}
          alt=""
          loading="lazy"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur">
          <Icon className="size-3.5" aria-hidden="true" />
          {category}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {readTime}
          </span>
        </div>
        <h2 className="mt-4 text-xl font-bold leading-snug tracking-[-0.025em] text-slate-950">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
          Demo article
          <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function BlogsPage() {
  return (
    <main className="overflow-hidden bg-[#f7f9f7]">
      <section className="relative isolate bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -right-24 -top-28 size-96 rounded-full bg-emerald-600/25 blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 size-[28rem] rounded-full bg-emerald-900/60 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
            <BookOpen className="size-4" aria-hidden="true" />
            Gari Vara journal
          </p>
          <h1 className="mt-7 max-w-4xl text-[clamp(2.7rem,8vw,5.2rem)] font-black leading-[0.98] tracking-[-0.055em]">
            Stories for smoother
            <span className="block text-emerald-400">journeys.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Demo travel guides, practical car-rental advice, destination ideas, and useful tips for the road ahead.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Blog categories">
            {categories.map((category, index) => (
              <span
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                  index === 0
                    ? "bg-emerald-700 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
                key={category}
              >
                {category}
              </span>
            ))}
          </div>

          <article className="mt-8 grid overflow-hidden rounded-3xl bg-emerald-900 text-white shadow-[0_28px_80px_-38px_rgba(6,78,45,0.7)] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-72 overflow-hidden lg:min-h-[28rem]">
              <img className="absolute inset-0 h-full w-full object-cover" src={cityRideImage} alt="A comfortable car journey through the city" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent lg:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-300">
                Featured story
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                Make every mile of your next journey count
              </h2>
              <p className="mt-5 text-base leading-7 text-emerald-50/75">
                From choosing a suitable vehicle to planning better stops, thoughtful preparation can turn travel time into part of the experience.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-emerald-100/75">
                <span>July 14, 2026</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-4" aria-hidden="true" />
                  8 min read
                </span>
              </div>
            </div>
          </article>

          <div className="mt-14 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Latest articles
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Ideas for the road ahead
              </h2>
            </div>
          </div>

          <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <ArticleCard key={post.title} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default BlogsPage;