import React from 'react';
import { Button, Card, CardBody } from "@nextui-org/react";
import { Droplet } from 'lucide-react';

interface Feature {
  name: FeatureName;
  label: string;
  samples: number;
}

interface FeatureSelectionBannerProps {
  features: Feature[];
  selectedFeature: FeatureName | null;
  getFeatureProgress: (feature: FeatureName) => [number, number];
  handleFeatureSelect: (feature: FeatureName) => void;
}

const FeatureSelectionBanner: React.FC<FeatureSelectionBannerProps> = ({
  features,
  selectedFeature,
  getFeatureProgress,
  handleFeatureSelect
}) => {
  return (
    <Card className="mb-4">
      <CardBody>
        <div className="flex flex-wrap gap-2">
          {features.map(feature => {
            const [current, total] = getFeatureProgress(feature.name);
            return (
              <Button
                key={feature.name}
                color={selectedFeature === feature.name ? "primary" : "secondary"}
                onPress={() => handleFeatureSelect(feature.name)}
                endContent={<Droplet />}
              >
                {feature.label} ({current}/{total})
              </Button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default FeatureSelectionBanner;