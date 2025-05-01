import React from 'react';

export default function PromptForm({ formData, setFormData }) {
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">What style do you want?</label>
        <select
          value={formData.style}
          onChange={handleChange('style')}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">Select</option>
          <option value="comic book">Comic Book</option>
          <option value="realistic">Realistic</option>
          <option value="3D render">3D Render</option>
          <option value="concept art">Concept Art</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">What’s the subject of the image?</label>
        <input
          type="text"
          value={formData.subject}
          onChange={handleChange('subject')}
          placeholder="e.g. a house with a for-sale sign"
          className="w-full border border-gray-300 rounded-lg p-2"
        />
      </div>
    </div>
  );
}
