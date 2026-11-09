import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/Logo New.png'
import Button from '../Button/Button'

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', to: '/car' },
      { label: 'Why choose us', to: '/why-choose-us' },
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', to: '/help' },
      { label: 'Terms & conditions', to: '/terms' },
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Cancellation policy', to: '/cancellation-policy' },
    ],
  },
]

const currentYear = new Date().getFullYear()

function FooterLinkGroup({ group }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
        {group.title}
      </h2>
      <ul className="mt-5 grid gap-3">
        {group.links.map(({ label, to }) => (
          <li key={to}>
            <Link
              className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
              to={to}
            >
              {label}
              <ArrowUpRight
                className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-b border-white/10 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-400">
              Ready for your next journey?
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
              Find the right ride in minutes.
            </h2>
          </div>
          <Button as={Link} className="self-start sm:self-auto" to="/car">
            Search cars
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.9fr_1fr]">
          <div>
            <Link
              className="inline-block rounded-lg bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              to="/car"
              aria-label="Gari Vara home"
            >
              <img className="h-11 w-auto" src={logo} alt="Gari Vara" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Reliable, comfortable transport backed by thoughtful service for
              every journey.
            </p>
          </div>

          {footerGroups.map((group) => (
            <FooterLinkGroup key={group.title} group={group} />
          ))}

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Contact
            </h2>
            <ul className="mt-5 grid gap-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                contact us at {'01712456789'}
              </li>
              <li>
                <a
                  className="flex items-start gap-3 transition-colors hover:text-white"
                  href="mailto:info@garivara.com"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  info@garivara.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Gari Vara. All rights reserved.</p>
          <p>Developed by The Software Engineers</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

