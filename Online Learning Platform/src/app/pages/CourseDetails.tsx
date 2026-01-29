import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  BarChart3,
  Users,
  BookOpen,
  Award,
  Star,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import LessonCard from "../components/instructor/LessonCard";
import { downloadCertificate } from "../../utils/downloadCertificate";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]); // store lesson IDs
  const [certificateReady, setCertificateReady] = useState(false);
  const [completedLoading, setCompletedLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");
    const res = fetch(`https://localhost:7000/api/Courses/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch course");
        return res.json();
      })
      .then((data) => setCourse(data))
      .catch((err) => console.error(err));
  }, [courseId]);

  const checkEnrollmentAndLessons = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setCheckingEnrollment(true);

      const res = await fetch(
        `https://localhost:7000/api/Student/course/${courseId}/is-enrolled`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) return;

      const isEnrolled = await res.json();
      setEnrolled(isEnrolled);

      if (isEnrolled) {
        setLoadingLessons(true);

        const lessonsRes = await fetch(
          `https://localhost:7000/api/Student/course/${courseId}/lessons`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (lessonsRes.ok) {
          const lessonsData = await lessonsRes.json();
          setLessons(lessonsData);
        }

        setLoadingLessons(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  useEffect(() => {
    checkEnrollmentAndLessons();
  }, [courseId]);

    const enroll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");
      const res = await fetch(
        `https://localhost:7000/api/Student/enroll/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId }),
        },
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to enroll");
      }

      await checkEnrollmentAndLessons();
      //setEnrolled(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!enrolled) return;

    const fetchLessonsAndCompleted = async () => {
      
      try {
        setLoadingLessons(true);
        setCompletedLoading(true);

        const token = localStorage.getItem("token");
        if (!token) return;

        const lessonRes = await fetch(
          `https://localhost:7000/api/Student/course/${courseId}/lessons`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!lessonRes.ok) throw new Error("Failed to fetch lessons");
        const lessonData = await lessonRes.json();
        setLessons(lessonData);

        // Fetch completed lessons
        const completedRes = await fetch(
          `https://localhost:7000/api/Student/course/${courseId}/completed-lessons`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!completedRes.ok)
          throw new Error("Failed to fetch completed lessons");
        const completedData: number[] = await completedRes.json(); // array of lesson IDs
        setCompletedLessons(completedData);

        // Check certificate eligibility
         // Compute certificate eligibility
      setCertificateReady(completedData.length === lessonData.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLessons(false);
        setCompletedLoading(false);
      }
    };

    fetchLessonsAndCompleted();
  }, [enrolled, courseId]);

  const markLessonCompleted = async (lessonId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch(
        `https://localhost:7000/api/Student/lesson/${lessonId}/complete`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.ok) throw new Error("Failed to mark lesson completed");

       setCompletedLessons((prev) => {
      const newCompleted = prev.includes(lessonId) ? prev : [...prev, lessonId];

      // Update certificate eligibility based on the new array
      setCertificateReady(newCompleted.length === lessons.length);

      return newCompleted;
    });
    } catch (err: any) {
      alert(err.message);
    }
  };



  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (checkingEnrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                {course.category}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>{course.level}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">${course.price}</span>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={enroll}
                  disabled={enrolled}
                >
                  {enrolled ? "Enrolled" : "Enroll Now"}
                </Button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                What You'll Learn
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Master the fundamentals and advanced concepts
                  </span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Build real-world projects from scratch
                  </span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Get hands-on experience with industry tools
                  </span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Receive a certificate upon completion
                  </span>
                </li>
              </ul>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Description
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  This comprehensive course is designed to take you from
                  beginner to expert. You'll learn through a combination of
                  video lectures, hands-on exercises, and real-world projects.
                </p>
                <p className="mb-4">
                  Our experienced instructor, {course.instructor}, brings years
                  of industry experience and will guide you through every step
                  of your learning journey.
                </p>
                <p>
                  Whether you're looking to start a new career, enhance your
                  current skills, or pursue a personal passion, this course
                  provides the knowledge and practical experience you need to
                  succeed.
                </p>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Content
              </h2>
              {!enrolled && (
                <div className="space-y-3">
                  {[
                    "Introduction and Setup",
                    "Core Concepts and Fundamentals",
                    "Intermediate Topics",
                    "Advanced Techniques",
                    "Project: Building Your First Application",
                    "Best Practices and Optimization",
                    "Deployment and Production",
                    "Final Project and Assessment",
                  ].map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">
                          {section}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.floor(Math.random() * 5) + 3} lessons
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {enrolled && (
                <>
                  {loadingLessons ? (
                    <p className="text-gray-500">Loading lessons...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                      {lessons.map((lesson) => {
                        const videoId = lesson.videoUrl?.match(
                          /(?:v=|\/)([0-9A-Za-z_-]{11})/,
                        )?.[1];

                        return (
                          <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            onClick={() => videoId && setActiveVideo(videoId)}
                          >
                            {!completedLessons.includes(lesson.id) && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  markLessonCompleted(lesson.id);
                                }}
                                className="mt-2"
                              >
                                Mark as Completed
                              </Button>
                            )}
                            {completedLessons.includes(lesson.id) && (
                              <span className="text-green-600 font-semibold mt-2 block">
                                Completed
                              </span>
                            )}
                          </LessonCard>
                        );
                      })}
                    </div>
                    
                  )}
                </>
              )}
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

              {certificateReady && (
  <div className="mt-6">
    <Button
  size="lg"
  className="bg-green-600 text-white hover:bg-green-700"
  onClick={() =>
    downloadCertificate(
      course.title,
      course.instructor
    )
  }
>
  Download Certificate
</Button>
  </div>
)}

            </div>
    

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {course.instructor
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {course.instructor}
                  </p>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">
                    {course.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium text-gray-900">
                    {course.level}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium text-gray-900">English</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={enroll}
                disabled={enrolled}
              >
                {enrolled ? "Enrolled" : `Enroll for $${course.price}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
