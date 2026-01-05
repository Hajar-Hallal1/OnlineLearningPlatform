import { useNavigate } from 'react-router-dom';
import { Clock, BarChart3, Users } from 'lucide-react';
import { Course } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 group"
    >
      <div className="relative overflow-hidden h-48">
        <ImageWithFallback
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            ${course.price}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2">
          <span className="inline-block bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
            {course.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="font-medium">by {course.instructor}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{course.duration}</span>
          </div>

          <div className="flex items-center space-x-1 text-gray-600">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">{course.level}</span>
          </div>

          {/* <div className="flex items-center space-x-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-xs">{course.students.toLocaleString()}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
