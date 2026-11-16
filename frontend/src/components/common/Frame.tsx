import React from 'react';

interface FrameProps {
  style?: 'natural-oak' | 'dark-walnut' | 'frame-gold' | 'minimal-linen' | string;
  className?: string;
  children: React.ReactNode;
}

export const Frame: React.FC<FrameProps> = ({ style = 'natural-oak', className = '', children }) => {
  const getFrameClasses = () => {
    switch (style) {
      case 'frame-gold':
      case 'ornate-gold':
        return 'p-3 bg-gradient-to-br from-[#D1BC8A] via-[#B49A65] to-[#8E7745] shadow-[0_15px_40px_rgba(37,35,33,0.35)] rounded-none border border-[#FAF7F2]/40';
      case 'dark-walnut':
      case 'frame-walnut':
        return 'p-3.5 bg-[#33261E] shadow-[0_20px_45px_rgba(20,19,18,0.45)] rounded-none border border-[#47382F]/50';
      case 'minimal-linen':
        return 'p-4 bg-[#EAE2D5] shadow-[0_12px_30px_rgba(37,35,33,0.14)] rounded-none border border-[#D8CEBF]';
      case 'natural-oak':
      default:
        return 'p-2.5 bg-[#D8C7B5] shadow-[0_12px_32px_rgba(37,35,33,0.18)] rounded-none border border-[#47382F]/15';
    }
  };

  return (
    <div className={`relative transition-all duration-500 ${getFrameClasses()} ${className}`}>
      {/* Inner matting groove */}
      <div className="bg-[#FAF7F2] p-1.5 shadow-inner">
        {children}
      </div>
    </div>
  );
};

