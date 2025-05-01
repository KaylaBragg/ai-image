import React from 'react';

export default function IndustrySelect({ value, onChange }) {
  return (
    <select 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-2 text-[#3f454f] focus:outline-none focus:ring-2 focus:ring-[#f28230]"
    >
      <option value="">Select Industry</option>
      <option value="real-estate">Real Estate</option>
      <option value="marketing">Marketing</option>
      <option value="ecommerce">E-commerce</option>
    </select>
  );
}
