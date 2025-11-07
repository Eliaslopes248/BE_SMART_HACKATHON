import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiGreenhouse } from "react-icons/si";

export default function Navbar() {
  // Light/Dark mode toggle (class-based)
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefersDark;
    setDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 ${
        scrolled
          ? 'border-b border-gray-200 dark:border-gray-800 shadow-md'
          : 'border-b border-transparent'
      } bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-all duration-200`}
    >
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center gap-2">
              <SiGreenhouse className="h-13 w-13 text-green-400" />
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">RE:Greensboro</span>
            </Link>
          </div>

          {/* Center: Nav links */}
          <div className="flex items-center justify-center flex-1 gap-10">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-green-200">Home</Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/your-profile" className="text-sm font-medium text-green-200">Your Profile</Link>
            </div>
          </div>

          {/* Right: Sign in */}
          <div className="flex items-center justify-end flex-1">
            <Link
              to="/login"
              className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

