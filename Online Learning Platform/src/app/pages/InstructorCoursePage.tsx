import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LessonCard from "../components/instructor/LessonCard";

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
}



export default function InstructorCoursePage() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizzes, setQuizzes] = useState<{ id: number; title: string }[]>([]);
  const [passingScore, setPassingScore] = useState(60);
  const [timeLimit, setTimeLimit] = useState(30);

  const [activeVideo, setActiveVideo] = useState<string | null>(null);


//fetch lessons and quiz
useEffect(() => {
  const fetchLessonsAndQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");

      // Fetch lessons
      const lessonsRes = await fetch(
        `https://localhost:7000/api/Instructor/course/${courseId}/lessons`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!lessonsRes.ok) throw new Error("Failed to fetch lessons");
      const lessonsData = await lessonsRes.json();
      setLessons(lessonsData);

      // Fetch quizzes
      const quizzesRes = await fetch(
        `https://localhost:7000/api/Instructor/course/${courseId}/quizzes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!quizzesRes.ok) throw new Error("Failed to fetch quizzes");
      const quizzesData = await quizzesRes.json();
      setQuizzes(quizzesData);
    } catch (err) {
      console.error(err);
    }
  };

  fetchLessonsAndQuizzes();
}, [courseId]);


//add lessons
const addLesson = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");

    const res = await fetch(`https://localhost:7000/api/Instructor/course/${courseId}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        title: title,
        content: content,
        videoUrl: videoUrl, 
        lessonOrder: lessons.length + 1
      }),
    });

    if (!res.ok) throw new Error("Failed to add lesson");

    const lessonAdded = await res.json();
    setLessons(prev => [...prev, lessonAdded]);

    setTitle("");
    setContent("");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

//add quiz
const addQuiz = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");

    const res = await fetch(`https://localhost:7000/api/Instructor/course/${courseId}/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: quizTitle,
        passingScore,  
        timeLimit,      
      }),
    });

    if (!res.ok) throw new Error("Failed to add quiz");

    const quizAdded = await res.json();
    alert("Quiz added successfully");
    setQuizTitle("");
    setPassingScore(60);
    setTimeLimit(30);
  } catch (err: any) {
    console.error(err);
    //alert(err.message);
  }
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Course</h1>

      {/* Lessons */}
      <div className="mb-8">
        <h2 className="font-semibold mb-2">Lessons</h2>

        <input
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="YouTube / Content URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          placeholder="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={addLesson}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Lesson
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
         {lessons.map((lesson) => {
          const videoId = lesson.videoUrl?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];

          return (
           <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => videoId && setActiveVideo(videoId)}
            />
          );
          })}
        </div>

      </div>

      {activeVideo && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-3xl p-4 relative">
      <button
        onClick={() => setActiveVideo(null)}
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
      >
        ✕
      </button>

      <iframe
        className="w-full aspect-video rounded"
        src={`https://www.youtube.com/embed/${activeVideo}`}
        title="Lesson Video"
        allowFullScreen
      />
    </div>
  </div>
)}


     
    </div>
  );
}
