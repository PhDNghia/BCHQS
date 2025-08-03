import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // ... (các hàm toggleVisibility và scrollToTop vẫn giữ nguyên) ...

  const toggleVisibility = () => {
    const mainContent = document.getElementById("main-content");
    const scrollableElement = mainContent || window;

    const scrollTop =
      scrollableElement === window ? window.scrollY : mainContent.scrollTop;

    if (scrollTop > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    const mainContent = document.getElementById("main-content");
    const scrollableElement = mainContent || window;

    if (scrollableElement) {
      scrollableElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    const scrollableElement = mainContent || window;

    const handleScroll = () => toggleVisibility();
    scrollableElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollableElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={scrollToTop}
        className={`
          bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 group
          hover:bg-red-700 cursor-pointer
          ${isVisible ? "opacity-100" : "opacity-0 cursor-not-allowed"}
        `}
        disabled={!isVisible}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transform rotate-180 transition-transform duration-300 group-hover:rotate-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTopButton;
