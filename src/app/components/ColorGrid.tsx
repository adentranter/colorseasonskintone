import React from 'react';
import { RGB, rgbToHex } from '@/lib/colorFinder';

interface ColorGridProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  onColorSelect: (feature: string, index: number) => void;
  features: {
    eyeColor: RGB[];
    underEyeColor: RGB[];
    hairColor: RGB[];
    'skinColors.cheeks': RGB[];
    'skinColors.neck': RGB[];
    'skinColors.nose': RGB[];
    'skinColors.forehead': RGB[];
  };
  currentColor: string | null;
}

const ColorGrid: React.FC<ColorGridProps> = ({
  position,
  onClose,
  onColorSelect,
  features,
  currentColor
}) => {
  if (!position) return null;

  // Close the grid when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="absolute bg-white rounded-lg shadow-lg p-4 w-[300px]"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: 'translate(-50%, 20px)'
        }}
      >
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(features).map(([feature, colors]) => (
            <div key={feature} className="p-2">
              <div className="text-xs font-medium mb-1">
                {feature.replace('skinColors.', '')}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className={`w-6 h-6 border rounded ${
                      colors[index] ? 'border-gray-400' : 'border-dashed border-gray-300'
                    }`}
                    style={{
                      backgroundColor: colors[index] ? rgbToHex(colors[index]) : 'transparent',
                      cursor: currentColor ? 'pointer' : 'default'
                    }}
                    onClick={() => currentColor && onColorSelect(feature, index)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {currentColor && (
          <div className="mt-2 flex items-center justify-center">
            <div 
              className="w-6 h-6 rounded"
              style={{ backgroundColor: currentColor }}
            />
            <span className="ml-2 text-sm">Current Color</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorGrid;