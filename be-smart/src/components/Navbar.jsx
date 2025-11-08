import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiGreenhouse } from "react-icons/si";
import { useUser } from './global-context/context_provider';
import { BsPlusSquare } from "react-icons/bs";


export default function Navbar() {
  // Get user authentication state
  const { user } = useUser();
  const isAuthenticated = !!user;
  
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
      <nav className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center gap-2">
              <SiGreenhouse className="h-13 w-13 text-green-400" />
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">RE:Greensboro</span>
            </Link>
          </div>

          {/* Center: Search Bar and Plus Icon */}
          <div className="flex items-center justify-center flex-1 px-4 gap-2">
            <input
              type="search"
              placeholder="Search..."
              className="w-full max-w-md h-10 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-outline text-base shadow-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {/* Only show Plus Icon when user is authenticated */}
            {isAuthenticated && (
              <Link to="/add-gig" className="flex items-center">
                <BsPlusSquare className="h-6 w-6 text-green-400 hover:text-green-500 cursor-pointer transition-colors" />
              </Link>
            )}
          </div>

          {/* Right: Home, Your Profile, and Sign in */}
          <div className="flex items-center justify-end flex-1 gap-4">
            <Link to="/" className="text-sm font-medium text-green-200 hover:text-green-300 transition-colors">
              Home
            </Link>
            {/* Only show Your Profile when user is authenticated */}
            {isAuthenticated && (
              <Link to="/your-profile" className="text-sm font-medium text-green-200 hover:text-green-300 transition-colors" data-discover="true">
                Your Profile
              </Link>
            )}
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

