import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizCard from "../quiz/QuizCard";

interface Answer {
  id: number;
  answerText: string;
}

interface Question {
  id: number;
  questionText: string;
  answers: Answer[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export default function StudentCoursePage() {
  const { courseId } = useParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not logged in");

        const res = await fetch(
          `https://localhost:7000/api/Student/course/${courseId}/quizzes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch quizzes");

        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [courseId]);

  if (loading) return <p className="p-6">Loading quizzes...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Course Quizzes</h1>

      {quizzes.length === 0 && (
        <p className="text-gray-500">No quizzes available yet.</p>
      )}

      <div className="space-y-4">
        {quizzes.map((q) => (
          <QuizCard
            key={q.id}
            quizId={q.id}
            title={q.title}
            questions={q.questions}
          />
        ))}
      </div>
    </div>
  );
}
