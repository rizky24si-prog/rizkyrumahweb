import React from 'react';

export default function InputField({ label, name, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="block text-[#ff8a5c] font-semibold mb-2 text-sm tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl bg-[#0f0f23] border text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] transition-all ${
          error ? 'border-red-500' : 'border-[#ff4655]/30'
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}