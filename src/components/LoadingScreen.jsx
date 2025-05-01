import React from 'react';

export default function LoadingScreen({ prompt }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fef9f6] text-[#3f454f] font-sans">
      <div className="text-center space-y-4">
        <p className="text-xl font-semibold">Generating image for:</p>
        <p className="italic text-[#ed5c2f]">"{prompt}"</p>
        <div className="mt-4 w-12 h-12 border-4 border-t-[#f28230] border-[#fab331] rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
