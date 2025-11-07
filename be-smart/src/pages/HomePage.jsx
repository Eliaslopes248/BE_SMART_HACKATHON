import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiGreenhouse } from "react-icons/si";

import aaVideo from '../assets/AA-Commercial-Video.mp4';

export default function HomePage() {


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
  const highlights = [
    {
      title: 'Reliability',
      description: 'Built with enterprise-grade patterns for consistency and uptime.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
    },
    {
      title: 'Security',
      description: 'Clear separation of concerns and standardized responses end-to-end.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
        </svg>
      ),
    },
    {
      title: 'Performance',
      description: 'Vite dev server, optimized assets, and mobile-first responsiveness.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3 7 4-14 3 7h5" />
        </svg>
      ),
    },
    {
      title: 'Supportability',
      description: 'Documented UI system, toasts, and hooks to speed up iteration.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-7 4h8M4 7h16" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Navbar */}
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

      {/* Full-bleed Corporate Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-64px)]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 via-sky-50 to-red-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800" />
        {/* Decorative shapes */}
        <div className="absolute -right-24 -top-24 w-[360px] h-[360px] rounded-full bg-blue-100 blur-2xl dark:bg-gray-700 -z-10 pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-[320px] h-[320px] rounded-full bg-red-100 blur-2xl dark:bg-gray-700 -z-10 pointer-events-none" />

        <div className="container py-16 pl-12 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Text content */}
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Sponsored by American Airlines
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Taking the Gate City forward, together.
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Proudly serving travelers across the globe with exceptional service, modern comfort, and a spirit that soars as high as our flag.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/dashboard" className="inline-flex items-center px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">Go to Dashboard</Link>
                <Link to="/problem" className="inline-flex items-center px-5 py-2.5 rounded-md border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800">View Problem</Link>
              </div>
            </div>

            {/* Right: Video */}
            <div className="w-full pr-12">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
                <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline disablePictureInPicture>
                  <source src={aaVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

