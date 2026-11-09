import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Home", to: "/car" },
  { label: "Why Choose Us", to: "/why-choose-us" },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact Us", to: "/contact" },
];

function NavigationLinks({ isMobile = false, onNavigate }) {
  const listStyles = isMobile
    ? "flex flex-col gap-1"
    : "flex items-center gap-9";

  return (
    <ul className={listStyles}>
      {navigationItems.map(({ label, to }) => (
        <li key={to}>
          <NavLink
            className={({ isActive }) =>
              [
                "block text-sm font-semibold transition-colors",
                isMobile
                  ? "rounded-lg px-3 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  : "relative py-7 text-slate-600 hover:text-slate-950",
                !isMobile && isActive
                  ? "text-emerald-700 after:absolute after:inset-x-0 after:bottom-5 after:h-0.5 after:rounded-full after:bg-emerald-600"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
            to={to}
            onClick={onNavigate}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default NavigationLinks;