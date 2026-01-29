import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

interface Answer {
  id: number;
  answerText: string;
}

interface Question {
  id: number;
  questionText: string;
  answers: Answer[];
}

interface QuizModalProps {
  quizId: number;
  quizTitle: string;
  questions: Question[];
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quizId, quizTitle, questions, onClose }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const handleSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    const payload = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
      questionId: Number(questionId),
      answerId,
    }));

    try {
      const res = await fetch(`https://localhost:7000/api/Student/quiz/${quizId}/attempt`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");

      const data = await res.json();
      setResult({ score: data.Score, passed: data.Passed });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">X</button>
        <h2 className="text-xl font-bold mb-4">{quizTitle}</h2>

        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            questionId={q.id}
            questionText={q.questionText}
            answers={q.answers}
            onAnswerSelect={handleSelect}
            selectedAnswerId={selectedAnswers[q.id]}
            correctAnswerId={submitted ? q.answers.find((a) => a.id === a.id)?.id : undefined} // backend does not return correct answers
            showResult={submitted}
          />
        ))}

        {!submitted && (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Submit Quiz
          </button>
        )}

        {submitted && result && (
          <div className="mt-4 text-lg font-semibold">
            Score: {result.score}% - {result.passed ? "Passed ✅" : "Failed ❌"}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
