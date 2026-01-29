import { Clock } from "lucide-react";
function UpcomingQuizCard({
  quiz,
}: {
  quiz: {
    quizTitle: string;
    courseTitle: string;
  };
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
      <div>
        <h4 className="font-semibold">{quiz.quizTitle}</h4>
        <p className="text-sm text-gray-500">{quiz.courseTitle}</p>
      </div>
      <Clock className="text-orange-500" />
    </div>
  );
}
export default UpcomingQuizCard;