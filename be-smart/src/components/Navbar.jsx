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

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

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
          ? 'border-b border-gray-200 dark:border-gray-800 shadow-sm'
          : 'border-b border-transparent'
      } bg-gradient-to-r from-blue-50 via-sky-50 to-red-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-shadow`}
    >
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <SiGreenhouse className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">RE:Greensboro</span>
          </Link>

          {/* Center: Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-blue-700 dark:text-blue-300">Home</Link>
          </div>

          {/* Right: Theme toggle + Sign in */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  Dark
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  Light
                </span>
              )}
            </button>
            <Link
              to="/login"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

