function CourseProgressCard({
  course,
}: {
  course: {
    title: string;
    progressPercent: number;
    lastLessonTitle?: string;
  };
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      <h3 className="text-lg font-semibold">{course.title}</h3>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{course.progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600">
        <strong>Last lesson:</strong>{" "}
        {course.lastLessonTitle ?? "Not started yet"}
      </p>
    </div>
  );
}
export default CourseProgressCard;