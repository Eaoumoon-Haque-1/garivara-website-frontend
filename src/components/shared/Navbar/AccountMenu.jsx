import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, MapPinned, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";

function AccountMenu({ user, onLogout, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const displayName =
    user?.name || user?.full_name || user?.mobile_no || "My account";

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeMenu = (event) => {
      if (event.key === "Escape") setIsOpen(false);
      if (
        event.type === "pointerdown" &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", closeMenu);
    document.addEventListener("pointerdown", closeMenu);

    return () => {
      document.removeEventListener("keydown", closeMenu);
      document.removeEventListener("pointerdown", closeMenu);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className={`flex items-center rounded-full p-1 text-slate-700 transition hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
          compact ? "" : "gap-2 pr-2"
        }`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open account menu"
      >
        <UserAvatar user={user} />
        {!compact && (
          <ChevronDown
            className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
          role="menu"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-bold text-slate-900">
              {displayName}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Signed in</p>
          </div>

          <Link
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
            to="/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <UserRound className="size-4" aria-hidden="true" />
            Profile
          </Link>
          <Link
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
            to="/my-travels"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <MapPinned className="size-4" aria-hidden="true" />
            My Travels
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            role="menuitem"
            onClick={onLogout}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;