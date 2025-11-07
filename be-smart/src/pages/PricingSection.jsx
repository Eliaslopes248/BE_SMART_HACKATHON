import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PricingSection({ showNavAndFooter = true }) {
  return (
    <>
      {showNavAndFooter && <Navbar />}
      
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-slate-900 text-4xl font-semibold">Pricing Table</h2>
          </div>
          <div className="overflow-x-auto mt-12">
            <table className="w-full border border-gray-300 border-collapse min-w-[980px]">
              <thead>
                <tr>
                  <th className="p-4 text-left border border-gray-300 max-w-[150px]">
                    <h3 className="text-slate-900 font-semibold text-lg whitespace-nowrap">Compare Plans</h3>
                    <p className="text-[13px] text-slate-600 font-normal mt-3 leading-relaxed">Choose your workspace plan according to your organisational plan</p>
                  </th>
                  <th className="p-4 text-center border border-gray-300 whitespace-nowrap max-w-[150px]">
                    <h3 className="text-slate-900 text-xl font-semibold">Free <span className="text-[13px] text-slate-600 font-normal">/Lifetime</span></h3>
                    <button type="button" className="w-full mt-6 px-4 py-2 text-[15px] font-medium rounded-md tracking-wide bg-gray-800 hover:bg-gray-900 text-white cursor-pointer">Choose Plan</button>
                  </th>
                  <th className="p-4 text-center border border-gray-300 whitespace-nowrap max-w-[150px]">
                    <h3 className="text-slate-900 text-xl font-semibold">$25 <span className="text-[13px] text-slate-600 font-normal">/Month</span></h3>
                    <button type="button" className="w-full mt-6 px-4 py-2 text-[15px] font-medium rounded-md tracking-wide bg-gray-800 hover:bg-gray-900 text-white cursor-pointer">Choose Plan</button>
                  </th>
                  <th className="p-4 text-center border border-gray-300 whitespace-nowrap max-w-[150px]">
                    <h3 className="text-slate-900 text-xl font-semibold">$40 <span className="text-[13px] text-slate-600 font-normal">/Month</span></h3>
                    <button type="button" className="w-full mt-6 px-4 py-2 text-[15px] font-medium rounded-md tracking-wide bg-gray-800 hover:bg-gray-900 text-white cursor-pointer">Choose Plan</button>
                  </th>
                </tr>
              </thead>

              <tbody className="border">
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    Number of Users
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium text-center border border-gray-300 max-w-[150px] text-sm">
                    20 Pages
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium text-center border border-gray-300 max-w-[150px] text-sm">
                    600 Pages
                    <p className="text-[13px] text-slate-600 font-normal mt-1">Pages Add-ons on Demand</p>
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium text-center border border-gray-300 max-w-[150px] text-sm">
                    Unlimited
                    <p className="text-[13px] text-slate-600 font-normal mt-1">Pages Add-ons on Demand</p>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    Users Per Page
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium text-center border border-gray-300 max-w-[150px] text-sm">
                    5 Pages
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium text-center border border-gray-300 max-w-[150px] text-sm">
                    50 Pages
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium text-center border border-gray-300 max-w-[150px] text-sm">
                    Unlimited
                    <p className="text-[13px] text-slate-600 font-normal mt-1">Pages Add-ons on Demand</p>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    Includes essential features to get started
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    More advanced features for increased productivity
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    Designing & Development
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    Customizable options to meet your specific needs
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    Secure data storage
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    Email Support
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    24/7 customer support
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-900 font-medium border border-gray-300 max-w-[150px] text-[15px]">
                    Analytics and reporting
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" className="fill-red-500 inline" viewBox="0 0 320.591 320.591">
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300 max-w-[150px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" className="fill-green-500 inline" viewBox="0 0 24 24">
                      <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showNavAndFooter && <Footer />}
    </>
  );
}