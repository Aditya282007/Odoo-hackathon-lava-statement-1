import React from 'react';
import { useApp } from '../context/AppContext';

export default function Chat() {
  const { user } = useApp();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        <p className="text-gray-600">Chat functionality coming soon...</p>
      </div>
    </div>
  );
}