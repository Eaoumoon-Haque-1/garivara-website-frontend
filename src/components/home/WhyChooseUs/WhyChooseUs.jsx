import {
  BadgeDollarSign,
  CarFront,
  Headphones,
  ShieldCheck,
} from 'lucide-react'
import SectionHeading from '../../shared/SectionHeading/SectionHeading'

const benefits = [
  {
    title: 'Cars for every journey',
    description:
      'Choose from a carefully selected range of clean, comfortable vehicles for any occasion.',
    Icon: CarFront,
  },
  {
    title: 'Transparent pricing',
    description:
      'Clear rates with no hidden surprises, so you always know what your journey will cost.',
    Icon: BadgeDollarSign,
  },
  {
    title: 'Safety you can trust',
    description:
      'Verified drivers and regularly inspected vehicles keep every ride dependable and secure.',
    Icon: ShieldCheck,
  },
  {
    title: 'Support when needed',
    description:
      'Our responsive support team stays available before, during, and after your journey.',
    Icon: Headphones,
  },
]

function BenefitCard({ benefit, index }) {
  const { title, description, Icon } = benefit

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_50px_-26px_rgba(15,23,42,0.28)] motion-reduce:transform-none motion-reduce:transition-none">
      <div className="absolute right-5 top-4 text-5xl font-bold tracking-[-0.06em] text-slate-100 transition-colors group-hover:text-emerald-50">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="relative grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
        <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
      </div>

      <h3 className="relative mt-6 text-lg font-bold tracking-[-0.02em] text-slate-950">
        {title}
      </h3>
      <p className="relative mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-emerald-700 transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
    </article>
  )
}

function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden bg-[#f7f9f7] py-20 sm:py-24"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full bg-emerald-100/45 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Gari Vara"
          title="A better standard for every journey"
          description="Thoughtful service, dependable vehicles, and support you can rely on—combined into one seamless experience."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
  )
}

export default WhyChooseUs

