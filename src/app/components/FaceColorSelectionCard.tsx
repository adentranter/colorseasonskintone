import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { ImageColorPicker } from 'react-image-color-picker';
import { RGB, rgbToHex } from '@/lib/colorFinder';

interface Feature {
  name: FeatureName;
  label: string;
  samples: number;
}

interface FaceColorSelectionCardProps {
  faceImage: string;
  handleColorPick: (color: string) => void;
  features: Feature[];
  getFeatureProgress: (feature: FeatureName) => [number, number];
  getFeatureColor: (featureName: FeatureName, index: number) => RGB | undefined;
}

const FaceColorSelectionCard: React.FC<FaceColorSelectionCardProps> = ({
  faceImage,
  handleColorPick,
  features,
  getFeatureProgress,
  getFeatureColor
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>Select Face Colors</CardHeader>
      <CardBody>
        <ImageColorPicker
          onColorPick={handleColorPick}
          imgSrc={faceImage}
          zoom={1}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {features.map(feature => {
            const [current, total] = getFeatureProgress(feature.name);
            return (
              <div key={feature.name} className="flex items-center">
                <span className="mr-2">{feature.label}:</span>
                {[...Array(total)].map((_, index) => {
                  const color = getFeatureColor(feature.name, index);
                  return (
                    <span
                      key={index}
                      className="inline-block w-6 h-6 border mr-1"
                      style={{
                        backgroundColor: color ? rgbToHex(color) : 'transparent'
                      }}
                    ></span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default FaceColorSelectionCard;