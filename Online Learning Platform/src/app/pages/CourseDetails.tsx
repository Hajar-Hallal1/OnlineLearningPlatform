import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BarChart3, Users, BookOpen, Award, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses } = useApp();

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
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
            onClick={() => navigate('/')}
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
              <p className="text-xl text-blue-100 mb-6">
                {course.description}
              </p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">${course.price}</span>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Enroll Now
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
                  <span className="text-gray-700">Master the fundamentals and advanced concepts</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Build real-world projects from scratch</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Get hands-on experience with industry tools</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Receive a certificate upon completion</span>
                </li>
              </ul>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  This comprehensive course is designed to take you from beginner to expert. 
                  You'll learn through a combination of video lectures, hands-on exercises, 
                  and real-world projects.
                </p>
                <p className="mb-4">
                  Our experienced instructor, {course.instructor}, brings years of industry 
                  experience and will guide you through every step of your learning journey.
                </p>
                <p>
                  Whether you're looking to start a new career, enhance your current skills, 
                  or pursue a personal passion, this course provides the knowledge and 
                  practical experience you need to succeed.
                </p>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
              <div className="space-y-3">
                {[
                  'Introduction and Setup',
                  'Core Concepts and Fundamentals',
                  'Intermediate Topics',
                  'Advanced Techniques',
                  'Project: Building Your First Application',
                  'Best Practices and Optimization',
                  'Deployment and Production',
                  'Final Project and Assessment'
                ].map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{section}</span>
                    </div>
                    <span className="text-sm text-gray-500">{Math.floor(Math.random() * 5) + 3} lessons</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {course.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{course.instructor}</p>
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
                  <span className="font-medium text-gray-900">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium text-gray-900">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrolled</span>
                  <span className="font-medium text-gray-900">{course.students.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium text-gray-900">English</span>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg">
                Enroll for ${course.price}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
