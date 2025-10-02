import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 text-center py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm text-blue-200/80 bg-black/35 backdrop-blur-md border-t border-white/10 select-none">
      <span>© {new Date().getFullYear()} All Rights Reserved • mi2o • </span>
      <a
        href="https://www.instagram.com/_.mi2o/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-yellow-300 hover:text-yellow-200 underline"
      >
        Instagram
      </a>
    </footer>
  );
};

export default Footer;
