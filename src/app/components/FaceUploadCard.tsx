import React from 'react';
import { Button, Card, CardHeader, CardBody } from "@nextui-org/react";
import { Upload } from 'lucide-react';

interface FaceUploadCardProps {
  faceInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'clothes') => void;
}

const FaceUploadCard: React.FC<FaceUploadCardProps> = ({ faceInputRef, handleImageUpload }) => {
  return (
    <Card className="mb-4">
      <CardHeader>Upload Face Photo</CardHeader>
      <CardBody>
        <Button
          color="primary"
          endContent={<Upload />}
          onPress={() => faceInputRef.current?.click()}
        >
          Upload face photo
        </Button>
        <input
          ref={faceInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'face')}
        />
      </CardBody>
    </Card>
  );
};

export default FaceUploadCard;