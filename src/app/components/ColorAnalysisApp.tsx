'use client'

import React, { useState, useRef } from 'react';
import { Button } from "@nextui-org/react";
import { Undertone, harmonizeColors, determineUndertone, RGB, rgbToHex } from '@/lib/colorFinder';
import FaceUploadCard from './FaceUploadCard';
import FeatureSelectionBanner from './FeatureSelectionBanner';
import FaceColorSelectionCard from './FaceColorSelectionCard';
import ClothesUploadCard from './ClothesUploadCard';
import UndertoneQuestionnaireCard from './UndertoneQuestionnaireCard';
import ColorPaletteResults from './ColorPaletteResults';

// Types and interfaces
interface ClothesItem {
  image: string;
  colors: { color: RGB; isAccent: boolean }[];
}

interface ColorData {
  hairColor: RGB[];
  eyeColor: RGB[];
  underEyeColor: RGB[];
  skinColors: {
    cheeks: RGB[];
    neck: RGB[];
    nose: RGB[];
    underEyes: RGB[];
    forehead: RGB[];
  };
}

type SkinColorKey = keyof ColorData['skinColors'];
type ColorFeature = keyof Omit<ColorData, 'skinColors'>;
type FeatureName = ColorFeature | `skinColors.${SkinColorKey}`;

interface ColorPalette {
  baseColors: string[];
  accentColors: string[];
  undertoneColors: string[];
}

const ColorAnalysisApp: React.FC = () => {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [clothesItems, setClothesItems] = useState<ClothesItem[]>([]);
  const [colorData, setColorData] = useState<ColorData>({
    hairColor: [],
    eyeColor: [],
    underEyeColor: [],
    skinColors: {
      cheeks: [],
      neck: [],
      nose: [],
      underEyes: [],
      forehead: []
    }
  });
  const [currentFeature, setCurrentFeature] = useState<string | null>(null);
  const [currentClothesItem, setCurrentClothesItem] = useState<number | null>(null);
  const [undertoneAnswers, setUndertoneAnswers] = useState<Record<string, 'A' | 'B' | 'C'>>({});
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<FeatureName | null>(null);

  const faceInputRef = useRef<HTMLInputElement>(null);
  const clothesInputRef = useRef<HTMLInputElement>(null);

  const features: Array<{ name: FeatureName; label: string; samples: number }> = [
    { name: 'hairColor', label: 'Hair Color', samples: 3 },
    { name: 'eyeColor', label: 'Eye Color', samples: 1 },
    { name: 'underEyeColor', label: 'Under Eye Color', samples: 3 },
    { name: 'skinColors.cheeks', label: 'Cheeks', samples: 3 },
    { name: 'skinColors.neck', label: 'Neck', samples: 3 },
    { name: 'skinColors.nose', label: 'Nose', samples: 3 },
    { name: 'skinColors.underEyes', label: 'Under Eyes', samples: 3 },
    { name: 'skinColors.forehead', label: 'Forehead', samples: 3 },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'clothes') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        if (type === 'face') {
          setFaceImage(imageDataUrl);
        } else {
          setClothesItems(prev => [...prev, { image: imageDataUrl, colors: [] }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorPick = (color: string) => {
    const rgb: RGB = [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16)
    ];

    if (currentFeature) {
      setColorData(prev => {
        const newData = { ...prev };
        const [feature, subFeature] = currentFeature.split('.') as [ColorFeature | 'skinColors', SkinColorKey?];
        
        if (feature === 'skinColors' && subFeature) {
          newData.skinColors[subFeature] = [...newData.skinColors[subFeature], rgb];
        } else if (feature in newData && Array.isArray(newData[feature])) {
          (newData[feature] as RGB[]).push(rgb);
        }
        return newData;
      });
    } else if (currentClothesItem !== null) {
      setClothesItems(prev => {
        const newItems = [...prev];
        newItems[currentClothesItem].colors.push({ color: rgb, isAccent: false });
        return newItems;
      });
    }
  };

  const toggleAccentColor = (itemIndex: number, colorIndex: number) => {
    setClothesItems(prev => {
      const newItems = [...prev];
      newItems[itemIndex].colors[colorIndex].isAccent = !newItems[itemIndex].colors[colorIndex].isAccent;
      return newItems;
    });
  };

  const handleUndertoneAnswer = (key: string, answer: 'A' | 'B' | 'C') => {
    setUndertoneAnswers(prev => ({ ...prev, [key]: answer }));
  };

  const analyzeColors = () => {
    const undertone = determineUndertone(
      undertoneAnswers.veinTest,
      undertoneAnswers.jewelryTest,
      undertoneAnswers.beachTest
    );

    const avgColor = (colors: RGB[]): RGB => {
      const sum = colors.reduce((acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]], [0, 0, 0]);
      return sum.map(v => Math.round(v / colors.length)) as RGB;
    };

    const personFeatures = {
      hairBlackPoint: Math.min(...colorData.hairColor.flatMap(c => c)),
      hairColor: avgColor(colorData.hairColor),
      eyeColor: colorData.eyeColor[0] || [0, 0, 0],
      underEyeColor: avgColor(colorData.underEyeColor),
      skinColors: {
        cheeks: avgColor(colorData.skinColors.cheeks),
        neck: avgColor(colorData.skinColors.neck),
        nose: avgColor(colorData.skinColors.nose),
        underEyes: avgColor(colorData.skinColors.underEyes),
        forehead: avgColor(colorData.skinColors.forehead),
      },
      lightingType: "natural",
      undertone,
    };

    const harmonizedColors = harmonizeColors(personFeatures);

    const palettes: ColorPalette[] = [
      {
        baseColors: harmonizedColors.slice(0, 3).map(rgbToHex),
        accentColors: harmonizedColors.slice(3, 5).map(rgbToHex),
        undertoneColors: harmonizedColors.slice(5, 7).map(rgbToHex),
      },
      {
        baseColors: harmonizedColors.slice(7, 10).map(rgbToHex),
        accentColors: harmonizedColors.slice(10, 12).map(rgbToHex),
        undertoneColors: harmonizedColors.slice(12, 14).map(rgbToHex),
      },
    ];

    setColorPalettes(palettes);
  };

  const isDataComplete = () => {
    return features.every(feature => {
      const [main, sub] = feature.name.split('.') as [keyof ColorData, SkinColorKey?];
      const data = sub ? colorData.skinColors[sub] : colorData[main];
      return data && data.length === feature.samples;
    }) && Object.keys(undertoneAnswers).length === 3;  // 3 is the number of undertone questions
  };

  const getFeatureColor = (featureName: FeatureName, index: number): RGB | undefined => {
    const [main, sub] = featureName.split('.') as [keyof ColorData, SkinColorKey?];
    if (sub) {
      return colorData.skinColors[sub][index];
    } else {
      return colorData[main][index];
    }
  };

  const handleFeatureSelect = (feature: FeatureName) => {
    setSelectedFeature(feature);
    setCurrentFeature(feature);
    setCurrentClothesItem(null);
  };

  const getFeatureProgress = (feature: FeatureName): [number, number] => {
    const [main, sub] = feature.split('.') as [keyof ColorData, SkinColorKey?];
    const data = sub ? colorData.skinColors[sub] : colorData[main];
    const samples = features.find(f => f.name === feature)?.samples || 0;
    return [data.length, samples];
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Color Analysis App</h1>
      
      <FaceUploadCard
        faceInputRef={faceInputRef}
        handleImageUpload={handleImageUpload}
      />

      {faceImage && (
        <FeatureSelectionBanner
          features={features}
          selectedFeature={selectedFeature}
          getFeatureProgress={getFeatureProgress}
          handleFeatureSelect={handleFeatureSelect}
        />
      )}

      {faceImage && (
        <FaceColorSelectionCard
          faceImage={faceImage}
          handleColorPick={handleColorPick}
          features={features}
          getFeatureProgress={getFeatureProgress}
          getFeatureColor={getFeatureColor}
        />
      )}

      <ClothesUploadCard
        clothesInputRef={clothesInputRef}
        handleImageUpload={handleImageUpload}
        clothesItems={clothesItems}
        setCurrentClothesItem={setCurrentClothesItem}
        toggleAccentColor={toggleAccentColor}
        setCurrentFeature={setCurrentFeature}
        setSelectedFeature={setSelectedFeature}
      />

      <UndertoneQuestionnaireCard
        undertoneAnswers={undertoneAnswers}
        handleUndertoneAnswer={handleUndertoneAnswer}
      />

      <Button 
        onPress={analyzeColors} 
        color="primary" 
        className="mb-4"
        isDisabled={!isDataComplete()}
      >
        Analyze Colors
      </Button>

      {colorPalettes.length > 0 && (
        <ColorPaletteResults colorPalettes={colorPalettes} />
      )}
    </div>
  );
};

export default ColorAnalysisApp;