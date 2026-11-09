import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/Logo New.png";
import { useAuth } from "../../../context/AuthStateContext";
import Button from "../Button/Button";
import AccountMenu from "./AccountMenu";
import NavigationLinks from "./NavigationLinks";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#e0ebe2] backdrop-blur-md">
      <div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-2 px-2 sm:min-h-20 sm:gap-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          className="w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
          to="/car"
          aria-label="Gari Vara home"
          onClick={closeMenu}
        >
          <img
            className="h-9 w-auto object-contain sm:h-12"
            src={logo}
            alt="Gari Vara"
          />
        </Link>

        <nav className="hidden lg:block" aria-label="Primary navigation">
          <NavigationLinks />
        </nav>

        <div className="hidden justify-self-end lg:block">
          {user ? (
            <AccountMenu user={user} onLogout={handleLogout} />
          ) : (
            <Button as={Link} to="/login" size="small">
              Login
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-self-end lg:hidden">
          {user && (
            <AccountMenu user={user} onLogout={handleLogout} compact />
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`border-t border-emerald-900/10 bg-[#e0ebe2] px-4 pb-5 pt-3 shadow-lg lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
        aria-label="Mobile navigation"
      >
        <div className="mx-auto max-w-7xl">
          <NavigationLinks isMobile onNavigate={closeMenu} />
          {!user && (
            <Button
              as={Link}
              className="mt-3"
              to="/login"
              fullWidth
              onClick={closeMenu}
            >
              Login
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;