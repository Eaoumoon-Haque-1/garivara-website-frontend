import { CalendarCheck, CarFront, CreditCard, MapPin } from 'lucide-react'
import SectionHeading from '../../shared/SectionHeading/SectionHeading'

const bookingSteps = [
  {
    title: 'Set your journey',
    description:
      'Choose your pickup, destination, and preferred travel time.',
    Icon: MapPin,
  },
  {
    title: 'Choose your ride',
    description:
      'Compare available vehicles and select the right fit for your trip.',
    Icon: CarFront,
  },
  {
    title: 'Confirm securely',
    description:
      'Review the details and complete your booking with secure payment.',
    Icon: CreditCard,
  },
  {
    title: 'Travel with confidence',
    description:
      'Receive your confirmation and enjoy a comfortable, reliable journey.',
    Icon: CalendarCheck,
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-950 py-20 sm:py-24"
    >
      <div
        className="pointer-events-none absolute -right-40 top-1/2 size-[34rem] -translate-y-1/2 rounded-full bg-emerald-800/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.5fr] lg:items-start lg:gap-20 lg:px-8">
        <div>
          <SectionHeading
            eyebrow="How it works"
            title="From search to road in four simple steps"
            description="A clear, straightforward booking process designed to get you moving without unnecessary friction."
            align="left"
            tone="dark"
          />

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.1)]" />
            Booking takes only a few minutes
          </div>
        </div>

        <ol className="relative grid gap-9 lg:grid-cols-4 lg:gap-6">
          <div
            className="absolute bottom-8 left-6 top-6 w-px bg-gradient-to-b from-emerald-500 via-emerald-500/40 to-transparent lg:bottom-auto lg:left-6 lg:right-6 lg:top-6 lg:h-px lg:w-auto lg:bg-gradient-to-r"
            aria-hidden="true"
          />

          {bookingSteps.map(({ title, description, Icon }, index) => (
            <li
              key={title}
              className="relative grid grid-cols-[3rem_1fr] gap-5 lg:block"
            >
              <div className="relative z-10 grid size-12 place-items-center rounded-2xl border border-emerald-400/30 bg-slate-900 text-emerald-400 shadow-[0_10px_30px_-12px_rgba(16,185,129,0.5)]">
                <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </div>

              <div className="lg:mt-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-500">
                  Step {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-lg font-bold tracking-[-0.02em] text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks

