import { InstructorStatsDto } from "../../types/InstructorStatsDto";
type Props = {
  instructor: InstructorStatsDto;
};

export function InstructorCard({ instructor }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-3">
      <div>
        <h3 className="text-lg font-semibold">{instructor.fullName}</h3>
        <p className="text-sm text-gray-500">{instructor.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <p>📚 Courses: {instructor.totalCourses}</p>
        <p>👨‍🎓 Students: {instructor.totalStudents}</p>
        <p>🧠 Avg Score: {instructor.quizAverageScore}%</p>
      </div>

      <div className="text-sm">
        <p>🏆 Best Quiz: {instructor.topQuizTitle ?? "N/A"}</p>
        <p>⚠️ Weak Quiz: {instructor.lowQuizTitle ?? "N/A"}</p>
      </div>
    </div>
  );
}
