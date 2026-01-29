import React, { useState } from "react";
import QuizModal from "./QuizModal";

interface Answer {
  id: number;
  answerText: string;
}

interface Question {
  id: number;
  questionText: string;
  answers: Answer[];
}

interface QuizCardProps {
  quizId: number;
  title: string;
  questions: Question[];
}

const QuizCard: React.FC<QuizCardProps> = ({ quizId, title, questions }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Start Quiz
      </button>

      {open && <QuizModal quizId={quizId} quizTitle={title} questions={questions} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default QuizCard;
