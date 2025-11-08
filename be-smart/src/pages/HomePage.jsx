import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import gCom from '../assets/Greensboro-Com.mp4';
import PricingSection from './PricingSection';
import Chatbot from '../components/chatbot/chatbot';
import ViewTopReports from './ViewTopReports';

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const suggestedServices = [
    'Website Development',
    'Architecture & Interior Design',
    'UGC Videos',
    'Video Editing',
    'Content Creation',
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or job map with query
      navigate(`/job-map?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleVideo = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  return (
    <>
      <Navbar />

      {/* Fiverr-style Hero Section with Background Video */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            style={{
              filter: 'brightness(0.4) contrast(1.1) saturate(0.7) blur(1px)',
            }}
          >
            <source src={gCom} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 min-h-screen flex flex-col">
          {/* Main Hero Content */}
          <div className="flex-1 flex items-center">
            <div className="max-w-4xl">
              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-tight mb-6">
                Our freelancers
                <br />
                will take it from here
              </h1>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for any service..."
                    className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                  />
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 my-1 mr-1 rounded-md transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Suggested Services Tags */}
              <div className="flex flex-nowrap gap-2 mb-8 overflow-x-auto">
                {suggestedServices.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(service);
                      navigate(`/job-map?search=${encodeURIComponent(service)}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-300/20 hover:bg-green-500/30 text-white rounded-full text-xs font-medium transition-colors whitespace-nowrap"
                  >
                    {service}
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                <Link
                  to="/job-map"
                  className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section: Trusted By & Video Controls */}
          <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/20">
            {/* Trusted By Section */}
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm font-light">Trusted by:</span>
              <div className="flex items-center gap-6 opacity-70">
                {/* Placeholder logos - you can replace with actual logo images */}
                <span className="text-white text-sm font-light">American Airlines</span>
                <span className="text-white text-sm font-light">Black Enterprise</span>
                <span className="text-white text-sm font-light">Toyota</span>
                <span className="text-white text-sm font-light">Verizon</span>
                <span className="text-white text-sm font-light">Fidelity</span>
                <span className="text-white text-sm font-light">McDonalds</span>
                <span className="text-white text-sm font-light">Nascar</span>
                <span className="text-white text-sm font-light">Pepsico</span>
                <span className="text-white text-sm font-light">Nationwide</span>
              </div>
            </div>

            {/* Video Play/Pause Button */}
            <button
              onClick={toggleVideo}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/80 hover:bg-gray-700/90 text-white transition-colors"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      <ViewTopReports />
      <PricingSection showNavAndFooter={false} />
      <Footer />
      <Chatbot />
    </>
  );
}

