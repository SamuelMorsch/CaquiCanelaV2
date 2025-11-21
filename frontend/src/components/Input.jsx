import React from 'react';

export default function Input(props) {
  return (
    <input
      {...props} // Repassa todas as props (id, name, type, value, onChange, etc.)
      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-brand-text placeholder-gray-400 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm"
    />
  );
}