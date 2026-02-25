import React, { useState } from 'react';

const Lanyard = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed z-50 cursor-move select-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Lanyard Container */}
      <div className="relative">
        {/* Lanyard String */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-8 bg-gradient-to-b from-gray-400 to-gray-300 rounded-t-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto -mt-1 shadow-sm"></div>
        </div>
        
        {/* ID Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-1 transition-all duration-200 hover:shadow-2xl hover:scale-105">
          {/* Photo Container */}
          <div className="w-48 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <img
              src="Foto.png"
              alt="Fady Fadhlurrohman"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Small Info Bar */}
          <div className="mt-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <p className="text-xs font-bold text-white text-center truncate">
              Fady F.
            </p>
          </div>
        </div>

        {/* Drag Hint */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>Drag me</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lanyard;