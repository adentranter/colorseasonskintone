import React from 'react';
import { Button, Card, CardHeader, CardBody, Image, Checkbox } from "@nextui-org/react";
import { Camera } from 'lucide-react';
import { RGB, rgbToHex } from '@/lib/colorFinder';

interface ClothesItem {
  image: string;
  colors: { color: RGB; isAccent: boolean }[];
}

interface ClothesUploadCardProps {
  clothesInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'clothes') => void;
  clothesItems: ClothesItem[];
  setCurrentClothesItem: React.Dispatch<React.SetStateAction<number | null>>;
  toggleAccentColor: (itemIndex: number, colorIndex: number) => void;
  setCurrentFeature: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedFeature: React.Dispatch<React.SetStateAction<FeatureName | null>>;
}

const ClothesUploadCard: React.FC<ClothesUploadCardProps> = ({
  clothesInputRef,
  handleImageUpload,
  clothesItems,
  setCurrentClothesItem,
  toggleAccentColor,
  setCurrentFeature,
  setSelectedFeature
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>Upload Favorite Clothes</CardHeader>
      <CardBody>
        <Button
          color="primary"
          endContent={<Camera />}
          onPress={() => clothesInputRef.current?.click()}
        >
          Upload clothes photo
        </Button>
        <input
          ref={clothesInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'clothes')}
        />
        <div className="flex flex-wrap mt-4">
          {clothesItems.map((item, index) => (
            <div key={index} className="m-2">
              <Image
                src={item.image}
                alt={`Favorite cloth ${index + 1}`}
                className="w-20 h-20 object-cover mb-2"
              />
              <Button
                size="sm"
                onPress={() => {
                  setCurrentClothesItem(index);
                  setCurrentFeature(null);
                  setSelectedFeature(null);
                }}
              >
                Pick Colors
              </Button>
              <div className="mt-2">
                {item.colors.map((colorItem, colorIndex) => (
                  <div key={colorIndex} className="flex items-center mb-1">
                    <span
                      className="inline-block w-6 h-6 border mr-2"
                      style={{ backgroundColor: rgbToHex(colorItem.color) }}
                    ></span>
                    <Checkbox
                      isSelected={colorItem.isAccent}
                      onChange={() => toggleAccentColor(index, colorIndex)}
                    >
                      Accent
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ClothesUploadCard;