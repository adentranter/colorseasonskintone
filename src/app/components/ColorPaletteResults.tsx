import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";

interface ColorPalette {
  baseColors: string[];
  accentColors: string[];
  undertoneColors: string[];
}

interface ColorPaletteResultsProps {
  colorPalettes: ColorPalette[];
}

const ColorPaletteResults: React.FC<ColorPaletteResultsProps> = ({ colorPalettes }) => {
  return (
    <Card>
      <CardHeader>Your Color Palettes</CardHeader>
      <CardBody>
        {colorPalettes.map((palette, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Palette {index + 1}</h3>
            <div className="mb-2">
              <h4 className="font-medium">Base Colors:</h4>
              <div className="flex">
                {palette.baseColors.map((color, i) => (
                  <div key={i} className="w-10 h-10 m-1" style={{backgroundColor: color}}></div>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <h4 className="font-medium">Accent Colors:</h4>
              <div className="flex">
                {palette.accentColors.map((color, i) => (
                  <div key={i} className="w-10 h-10 m-1" style={{backgroundColor: color}}></div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium">Undertone Colors:</h4>
              <div className="flex">
                {palette.undertoneColors.map((color, i) => (
                  <div key={i} className="w-10 h-10 m-1" style={{backgroundColor: color}}></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default ColorPaletteResults;