import React from 'react';

export default function SelectField({ label, name, options, value, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="block text-[#ff8a5c] font-semibold mb-2 text-sm tracking-wide">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl bg-[#0f0f23] border text-gray-300 focus:outline-none focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] transition-all appearance-none cursor-pointer ${
          error ? 'border-red-500' : 'border-[#ff4655]/30'
        }`}
        style={{ color: '#e5e7eb' }}
      >
        <option value="" className="text-gray-500">Pilih {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.label} className="text-white bg-[#1a1a2e]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}