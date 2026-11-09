import { Check, Smartphone } from "lucide-react";
import appImage from "../../../assets/appBG.jpg.jpeg";
import googlePlayBadge from "../../../assets/google-play-badge.png";
import iosBadge from "../../../assets/ios.png";

const appBenefits = [
  "Book your journey in fewer steps",
  "Keep trip details close at hand",
  "Reach support whenever you need it",
];

export function StoreButtons({ stackOnMobile = false }) {
  const storeButtonClass =
    `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 motion-reduce:transition-none ${stackOnMobile ? "h-10 w-28 sm:h-[3.875rem] sm:w-40" : "h-14 w-36 sm:h-[3.875rem] sm:w-40"}`;

  return (
    <div
      className={`flex gap-2 ${stackOnMobile ? "flex-col items-start sm:flex-row sm:items-center max-sm:gap-0" : "flex-wrap items-center"}`}
      aria-label="Download the Gari Vara app"
    >
      <a
        className={storeButtonClass}
        aria-label="Get Gari Vara on Google Play"
        href="https://play.google.com/store/apps/details?id=com.whatsapp.w4b"
      >
        <img
          className="h-full w-full scale-[1.145] object-contain max-sm:scale-[1.24]"
          src={googlePlayBadge}
          alt="Get it on Google Play"
        />
      </a>

      <a
        className={storeButtonClass}
        aria-label="Download Gari Vara on the App Store"
      >
        <img
          className="h-full w-full object-contain"
          src={iosBadge}
          alt="Download on the App Store"
        />
      </a>
    </div>
  );
}
function AppDownload() {
  return (
    <section className=" py-12 sm:py-16" aria-labelledby="app-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:min-h-[30rem] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative z-10 order-2 flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-12 lg:order-1 lg:py-16 lg:pl-14 lg:pr-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md">
              <Smartphone className="size-5" aria-hidden="true" />
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Gari Vara on the go
            </p>
            <h2
              id="app-title"
              className="mt-3 max-w-xl text-2xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl"
            >
              Download the Gari Vara mobile app
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Plan, book, and manage your journeys from one simple mobile
              experience.
            </p>

            <ul className="mt-7 grid gap-3">
              {appBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check
                      className="size-3.5"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <StoreButtons />
            </div>
          </div>

          <div className="relative order-1 aspect-[4/3] min-h-0 bg-white sm:aspect-[3/2] lg:order-2 lg:-ml-18 lg:aspect-auto lg:min-h-full">
            <img
              className="absolute inset-0 h-full w-full object-contain object-center lg:object-right"
              src={appImage}
              alt="Gari Vara mobile app preview"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppDownload;
