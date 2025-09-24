// src/components/CriticalLoader.jsx
import React from 'react';

// Минималистичный загрузчик для критического контента
const CriticalLoader = ({ className = "" }) => {
  return (
    <div className={`critical-loader ${className}`}>
      <style jsx>{`
        .critical-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #000000;
        }
        .loader-dots {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        .loader-dots div {
          position: absolute;
          top: 33px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #fff;
          animation: loader-dots 1.2s linear infinite;
        }
        .loader-dots div:nth-child(1) {
          left: 8px;
          animation-delay: 0s;
        }
        .loader-dots div:nth-child(2) {
          left: 8px;
          animation-delay: -0.4s;
        }
        .loader-dots div:nth-child(3) {
          left: 32px;
          animation-delay: -0.4s;
        }
        .loader-dots div:nth-child(4) {
          left: 56px;
          animation-delay: -0.4s;
        }
        .loader-dots div:nth-child(5) {
          left: 56px;
          animation-delay: 0s;
        }
        @keyframes loader-dots {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
      <div className="loader-dots">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default CriticalLoader;