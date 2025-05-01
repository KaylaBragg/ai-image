import React, { useState } from 'react';
import PromptForm from '../components/PromptForm';
import LoadingScreen from '../components/LoadingScreen';
import ImageResult from '../components/ImageResult';

export default function Home() {
  const [formData, setFormData] = useState({
    style: '',
    subject: '',
  });

  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('form');
  const [imageUrl, setImageUrl] = useState('');

  const handleGenerate = async () => {
const fullPrompt = `No text or symbols. A bold, high-resolution illustration of ${formData.subject} in ${formData.style} style. Clear subject focus, sharp composition, vibrant contrast, rich textures, dynamic lighting. ${
  formData.style.toLowerCase() === "comic book"
    ? "Use thick ink outlines, comic shading, bold shadows, dramatic angles."
    : ""
} Clean, subtle background. Optimized for print.`;


    setPrompt(fullPrompt);
    setStatus('loading');
    const generatedImageUrl = await generateImage(fullPrompt);
    setImageUrl(generatedImageUrl);
    setStatus('result');
  };

  const handleRestart = () => {
    setFormData({ style: '', subject: '' });
    setPrompt('');
    setImageUrl('');
    setStatus('form');
  };

  if (status === 'loading') return <LoadingScreen prompt={prompt} />;
  if (status === 'result') {
    return (
      <ImageResult
        imageUrl={imageUrl}
        originalPrompt={prompt}
        onRestart={handleRestart}
        onRegenerate={handleGenerate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9f6] flex flex-col items-center justify-center px-4 font-sans text-[#3f454f]">
      <div className="max-w-lg w-full bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h1 className="text-3xl font-bold text-[#ed5c2f] text-center">AI Image Generator</h1>
        <PromptForm formData={formData} setFormData={setFormData} />
        <button
          onClick={handleGenerate}
          disabled={!formData.style || !formData.subject}
          className="w-full bg-[#f28230] hover:bg-[#fab331] text-white font-semibold py-2 px-4 rounded-lg transition mt-2"
        >
          Generate Image
        </button>
      </div>
    </div>
  );
}
const generateImage = async (prompt) => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();
  return data.image;
};

