import React, { useState } from 'react';

export default function ImageResult({ imageUrl, originalPrompt, onRestart, onRegenerate }) {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
  

  const handleRegenerate = () => {
    if (!feedback.trim()) {
      setError('Please describe what you want improved.');
      return;
    }
    setError('');
    const newPrompt = `${originalPrompt} Please improve the image based on this feedback: ${feedback}`;
    onRegenerate(newPrompt);
  };

  return (
    <div className="min-h-screen bg-[#fef9f6] flex flex-col items-center justify-center px-4 text-[#3f454f] font-sans">
      <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-md space-y-4 text-center">
        <img src={imageUrl} alt="Generated" className="w-full rounded-lg shadow-md" />
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="bg-[#fab331] hover:bg-[#f28230] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Download
          </button>
          <button
            onClick={onRestart}
            className="bg-gray-300 hover:bg-gray-400 text-[#3f454f] font-semibold py-2 px-4 rounded-lg transition"
          >
            Start Over
          </button>
        </div>

        <div className="text-left mt-4">
          <label className="block font-semibold mb-1">
            What would you like changed or improved?
          </label>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Make it brighter, add a tree..."
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            onClick={handleRegenerate}
            className="mt-2 w-full bg-[#ed5c2f] hover:bg-[#f28230] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Regenerate Image
          </button>
        </div>
      </div>
    </div>
  );
}
