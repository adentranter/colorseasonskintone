import React from 'react';
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";

interface UndertoneQuestionnaireCardProps {
  undertoneAnswers: Record<string, 'A' | 'B' | 'C'>;
  handleUndertoneAnswer: (key: string, answer: 'A' | 'B' | 'C') => void;
}

const undertoneQuestions = [
  { key: 'veinTest', question: 'On the underside of your wrists, your veins look:' },
  { key: 'jewelryTest', question: 'Which jewelry colors do you look best in?' },
  { key: 'beachTest', question: 'Does your skin turn red easily in the sun?' },
] as const;

const UndertoneQuestionnaireCard: React.FC<UndertoneQuestionnaireCardProps> = ({
  undertoneAnswers,
  handleUndertoneAnswer
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>Undertone Questionnaire</CardHeader>
      <CardBody>
        {undertoneQuestions.map(q => (
          <div key={q.key} className="mb-4">
            <p>{q.question}</p>
            {['A', 'B', 'C'].map(option => (
              <Button
                key={option}
                color={undertoneAnswers[q.key] === option ? "primary" : "default"}
                className="mr-2 mt-2"
                onPress={() => handleUndertoneAnswer(q.key, option as 'A' | 'B' | 'C')}
              >
                {option}
              </Button>
            ))}
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default UndertoneQuestionnaireCard;