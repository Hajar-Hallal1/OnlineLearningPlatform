import React, { useState } from "react";

interface Answer {
  id: number;
  answerText: string;
}

interface QuestionCardProps {
  questionId: number;
  questionText: string;
  answers: Answer[];
  onAnswerSelect: (questionId: number, answerId: number) => void;
  selectedAnswerId?: number;
  correctAnswerId?: number;
  showResult?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionId,
  questionText,
  answers,
  onAnswerSelect,
  selectedAnswerId,
  correctAnswerId,
  showResult = false,
}) => {
  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="font-semibold mb-2">{questionText}</h3>
      <div className="space-y-2">
        {answers.map((a) => {
          let bgClass = "bg-gray-100";
          if (showResult) {
            if (a.id === selectedAnswerId && a.id !== correctAnswerId) bgClass = "bg-red-400 text-white";
            if (a.id === correctAnswerId) bgClass = "bg-green-400 text-white";
          }

          return (
            <button
              key={a.id}
              className={`w-full p-2 rounded ${bgClass}`}
              onClick={() => !showResult && onAnswerSelect(questionId, a.id)}
              disabled={showResult}
            >
              {a.answerText}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
