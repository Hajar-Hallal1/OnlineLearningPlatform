import { useState } from "react";
interface AddQuizProps {
  courseId: number;
}

interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export default function AddQuiz({ courseId }: { courseId: number }) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const updateQuestionText = (index: number, value: string) => {
    const copy = [...questions];
    copy[index].questionText = value;
    setQuestions(copy);
  };

  const updateOption = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    const copy = [...questions];
    copy[qIndex].options[optIndex] = value;
    setQuestions(copy);
  };

  const updateCorrectAnswer = (qIndex: number, value: number) => {
    const copy = [...questions];
    copy[qIndex].correctAnswerIndex = value;
    setQuestions(copy);
  };

  const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  const payload = {
    title,
    courseId,
    questions,
  };

  const response = await fetch("/api/quizzes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    alert("Failed to add quiz ❌");
    return;
  }

  alert("Quiz added successfully ✅");
};


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h2 className="text-xl font-bold">Add Quiz</h2>

      {/* Quiz title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quiz Title
        </label>
        <input
          className="w-full border rounded-md px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Questions */}
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="border rounded-lg p-4 space-y-4"
        >
          <h3 className="font-semibold">
            Question {qIndex + 1}
          </h3>

          <input
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Question text"
            value={q.questionText}
            onChange={(e) =>
              updateQuestionText(qIndex, e.target.value)
            }
          />

          {/* Options */}
          {q.options.map((opt, optIndex) => (
            <div key={optIndex} className="flex items-center gap-3">
              <input
                type="radio"
                name={`correct-${qIndex}`}
                checked={q.correctAnswerIndex === optIndex}
                onChange={() =>
                  updateCorrectAnswer(qIndex, optIndex)
                }
              />

              <input
                className="flex-1 border px-3 py-2 rounded-md"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) =>
                  updateOption(qIndex, optIndex, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={addQuestion}
          className="border px-4 py-2 rounded-md hover:bg-gray-100"
        >
          + Add Question
        </button>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
}
