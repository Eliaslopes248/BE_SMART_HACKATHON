import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import gCom from '../assets/Greensboro-Com.mp4';

export default function HomePage() {
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
      <Navbar />

      {/* Full-bleed Corporate Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-64px)]">
        <div 
          className="absolute inset-0 -z-10 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800" 
          style={{
            background: 'linear-gradient(to right, #f0fdf4, #b0fcb9, #d1fae5)'
          }}
        />
        {/* Decorative shapes */}
        <div className="absolute -right-24 -top-24 w-[360px] h-[360px] rounded-full bg-green-200 blur-3xl dark:bg-green-900/30 -z-10 pointer-events-none opacity-70" />
        <div className="absolute -left-24 -bottom-24 w-[320px] h-[320px] rounded-full bg-[#b0fcb9] blur-3xl dark:bg-green-800/20 -z-10 pointer-events-none opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-100 blur-3xl dark:bg-green-900/20 -z-10 pointer-events-none opacity-40" />

        <div className="container py-16 pl-12 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Text content */}
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-700">
              Taking the Gate City forward, together.
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl">
              Empowering Greensboro with transparent data, modern tools, and a shared vision for growth that works for everyone.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/dashboard" className="inline-flex items-center px-5 py-2.5 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-600">Go to Dashboard</Link>
                <Link to="/problem" className="inline-flex items-center px-5 py-2.5 rounded-md border border-gray-300 text-gray-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition-colors dark:border-gray-600 dark:hover:text-white dark:hover:border-green-500 dark:hover:bg-green-900/20">View Problem</Link>
              </div>
            </div>

            {/* Right: Video */}
            <div className="w-full pr-12">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
                <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline disablePictureInPicture>
                  <source src={gCom} type="video/mp4" />
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

