import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import heroImage from "../../../assets/slider_1.jpg.jpeg";
import heroImage2 from "../../../assets/slider2_bg.jpg.jpeg";
import TypewriterText from "../../shared/TypewriterText/TypewriterText";
import { StoreButtons } from "../AppDownload/AppDownload";

const slides = [
  {
    id: "reliable-car-rental",
    image: heroImage,
    eyebrow: ["Reliable.", "Safe.", "On time."],
    title: "Your journey,",
    highlightedTitle: "our responsibility.",
    description:
      "Book dependable, comfortable transport for everyday trips and important journeys.",
  },
  {
    id: "comfortable-everyday-travel",
    image: heroImage2,
    eyebrow: ["Comfort.", "Confidence.", "Every mile."],
    title: "Travel confidently,",
    highlightedTitle: "arrive comfortably.",
    description:
      "A premium booking experience backed by dependable vehicles and responsive support.",
  },
];


const typingSpeed = 55;
const highlightedTitleDelay = (title) => 180 + title.length * typingSpeed + 180;

function EyebrowText({ phrases }) {
  return (
    <span className="flex flex-wrap gap-x-1.5">
      {phrases.map((phrase, index) => (
        <span
          key={phrase}
          className="eyebrow-blink"
          style={{ animationDelay: `${index * 300}ms` }}
        >
          {phrase}
        </span>
      ))}
    </span>
  );
}

function CarouselButton({ direction, onClick }) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      className="pointer-events-auto grid size-8 place-items-center rounded-full border border-white/70 bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 sm:size-10"
      type="button"
      aria-label={`${direction === "previous" ? "Previous" : "Next"} slide`}
      onClick={onClick}
    >
      <Icon className="size-4 sm:size-5" aria-hidden="true" />
    </button>
  );
}

function HeroCarousel() {
  const [autoplayPlugin] = useState(() =>
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [viewportRef, emblaApi] = useEmblaCarousel(
    { loop: false, containScroll: "trimSnaps" },
    [autoplayPlugin],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateSelectedIndex = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;

    emblaApi.on("select", updateSelectedIndex);
    emblaApi.on("reInit", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
      emblaApi.off("reInit", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#e0ebe2]"
      aria-roledescription="carousel"
      aria-label="Featured journeys"
    >
      <div ref={viewportRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => {
            const isActive = selectedIndex === index;

            return (
              <article
                key={slide.id}
                className="hero-slide-background relative min-w-0 flex-[0_0_100%]  overflow-hidden bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
                aria-hidden={!isActive}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#e0ebe2]/60 via-[#e0ebe2]/10 to-transparent lg:bg-gradient-to-br lg:from-[#e0ebe2]/75 lg:via-[#e0ebe2]/75 lg:via-15% lg:to-35%"
                />

                <div className="relative mx-auto flex min-h-[20rem] max-w-7xl items-start px-4 pb-6 pt-[4.75rem] sm:min-h-[34rem] sm:items-center sm:pb-24 sm:pt-10 md:min-h-[36rem] md:px-8 md:pb-28 md:pt-12 lg:min-h-[32rem] lg:px-20 lg:py-12">
                  <div className="w-full max-w-xl">
                    <p className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-emerald-200 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-emerald-800 shadow-sm backdrop-blur sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs sm:tracking-[0.14em]">
                      <ShieldCheck
                        className="size-3 sm:size-4"
                        aria-hidden="true"
                      />
                      <EyebrowText phrases={slide.eyebrow} />
                    </p>

                    <h1 className="mt-1.5 text-[clamp(1.35rem,6.8vw,1.7rem)] font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:mt-5 sm:text-4xl sm:leading-[1.05] md:text-5xl lg:text-6xl">
                      <TypewriterText
                        key={`${slide.id}-title-${isActive}`}
                        text={slide.title}
                        animate={isActive}
                        delay={180}
                        speed={typingSpeed}
                      />
                      <TypewriterText
                        key={`${slide.id}-highlight-${isActive}`}
                        className="mt-1 text-[#18723a]"
                        text={slide.highlightedTitle}
                        animate={isActive}
                        delay={highlightedTitleDelay(slide.title)}
                        speed={typingSpeed}
                      />
                    </h1>

                    <p className="mt-4 hidden max-w-lg text-sm leading-6 text-slate-700 sm:mt-5 sm:block sm:text-base sm:leading-7 lg:text-lg">
                      {slide.description}
                    </p>

                    <div className="mt-5 sm:mt-7">
                      <StoreButtons stackOnMobile />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-20 mx-auto flex max-w-7xl justify-end gap-2 px-4 lg:inset-y-1/2 lg:bottom-auto lg:max-w-[90rem] lg:-translate-y-1/2 lg:justify-between lg:gap-0 lg:px-6">
        <CarouselButton
          direction="previous"
          onClick={() => emblaApi?.scrollPrev()}
        />
        <CarouselButton
          direction="next"
          onClick={() => emblaApi?.scrollNext()}
        />
      </div>
    </section>
  );
}

export default HeroCarousel;
