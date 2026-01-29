interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    videoUrl: string;
  };
  onClick: () => void;
  children?: React.ReactNode;
}

export default function LessonCard({ lesson, onClick, children }: LessonCardProps) {
  const videoId = lesson.videoUrl
    ? lesson.videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1]
    : null;

  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "https://via.placeholder.com/320x180?text=No+Video";

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition"
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={lesson.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
          <span className="text-white text-4xl">▶</span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate">
          {lesson.title}
        </h3>
        {children}
      </div>
    </div>
  );
}
