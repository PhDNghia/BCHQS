import React from "react";

const LoadingButton = ({ isLoading, children, className = "", ...props }) => {
  return (
    <button
      disabled={isLoading}
      className={`relative flex items-center justify-center px-4 py-2 rounded transition duration-150 ease-in-out ${className} ${
        isLoading ? "cursor-wait opacity-80" : ""
      }`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          ></path>
        </svg>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};

export default LoadingButton;
