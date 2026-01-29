import { useEffect, useState } from "react";
import { StudentDashboardDto } from "../types/student-dashboard";
import { BookOpen, CheckCircle, Clock, Award } from "lucide-react";
import SummaryCard from "../components/student/SummaryCard";
import CourseProgressCard from "../components/student/CourseProgressCard";
import UpcomingQuizCard from "../components/student/UpcomingQuizCard";
import { Course } from '../types';
import { CourseCard } from "../components/CourseCard";

export default function StudentDashboard() {
  const [data, setData] = useState<StudentDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourse, setLoadingCourse] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://localhost:7000/api/Student/Dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to load dashboard");

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  

    useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://localhost:7000/api/Student/enrolled-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch enrolled courses");
        return;
      }

      const data = await res.json();
      setCourses(data);
      setLoadingCourse(false);
    };

    fetchEnrolledCourses();
  }, []);
  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load dashboard
      </div>
    );
  }
  if (loadingCourse) return <div className="p-8">Loading courses...</div>;

  const totalCourses = courses.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">🎓 Student Dashboard</h1>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          icon={<Award />}
          title="Average Score"
          value={`${data.scores.averageScore.toFixed(1)}%`}
        />
        <SummaryCard
          icon={<BookOpen />}
          title="Total Enrolled Courses"
          value={totalCourses}
        />
        <SummaryCard
          icon={<CheckCircle />}
          title="Passed Quizzes"
          value={data.scores.passedQuizzes}
        />
      </div>

      {/* ===== ENROLLED COURSES ===== */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">📚 Enrolled Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.enrolledCourses.map((course) => (
            <CourseProgressCard
              key={course.courseId}
              course={{
                ...course,
                lastLessonTitle: course.lastLessonTitle,
              }}
            />
          ))}
        </div> */}
      </section>

      {/* ===== UPCOMING QUIZZES ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">⏰ Upcoming Quizzes</h2>

        {data.upcomingQuizzes.length === 0 ? (
          <p className="text-gray-500">No upcoming quizzes 🎉</p>
        ) : (
          <div className="space-y-4">
            {data.upcomingQuizzes.map((quiz) => (
              <UpcomingQuizCard key={quiz.quizId} quiz={quiz} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
