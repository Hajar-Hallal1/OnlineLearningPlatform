import { useState } from 'react';
import { Plus, Trash2, Edit, TrendingUp, BookOpen, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Course } from '../types';
import { toast } from 'sonner';

export function InstructorDashboard() {
  const { courses, students, addCourse, deleteCourse } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortdescription: '',
    instructor: '',
    duration: '',
    level: 'Beginner',
    price: '',
    category: '',
    imageUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleAddCourse = async (e: React.FormEvent) => {
  e.preventDefault();

  // Take all form fields from formData
  const courseToAdd = {
    title: formData.title,
    description: formData.description,
    shortDescription: formData.shortdescription,
    duration: formData.duration,
    level: formData.level,
    price: parseFloat(formData.price),
    category: formData.category,
    imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop',
    instructor: formData.instructor,
  };

  try {
    const response = await fetch("https://localhost:7000/api/Instructor/AddCourse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseToAdd)
    });

    if (!response.ok) throw new Error("Failed to add course");

    const addedCourse = await response.json();

    // Update local React state
    addCourse({
      id: addedCourse.id,
      title: addedCourse.title,
      description: addedCourse.description,
      shortdescription: addedCourse.shortdescription,
      instructor: addedCourse.instructor,
      duration: addedCourse.duration,
      level: addedCourse.level,
      price: addedCourse.price,
      category: addedCourse.category,
      imageUrl: addedCourse.imageUrl,
      students: 0
    });

    toast.success("Course added successfully!");
    setIsAddDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      shortdescription: '',
      instructor: '',
      duration: '',
      level: 'Beginner',
      price: '',
      category: '',
      imageUrl: ''
    });

  } catch (err: any) {
    console.error(err);
    toast.error(err.message);
  }
};


  const handleDeleteCourse = (courseId: number, courseName: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseName}"?`)) {
      deleteCourse(courseId);
      toast.success('Course deleted successfully!');
    }
  };

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + (course.students * course.price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Manage your courses and monitor student progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Courses</CardTitle>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{courses.length}</div>
              <p className="text-sm text-gray-500 mt-1">Active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
              <Users className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalStudents.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">From all courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Management */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter course description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="shortdescription">Short Description</Label>
                    <Textarea
                      id="shortdescription"
                      name="shortdescription"
                      value={formData.shortdescription}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter course description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instructor">Instructor Name</Label>
                      <Input
                        id="instructor"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter instructor name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 8 weeks"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="level">Level</Label>
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter price"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Web Development"
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Image URL (optional)</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Course</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">by {course.instructor}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>{course.students} students</span>
                      <span>•</span>
                      <span>${course.price}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Management */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Student Management</h2>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {student.enrolledCourses.length} courses enrolled
                  </div>
                </div>

                <div className="space-y-3">
                  {student.enrolledCourses.map((courseId) => {
                    const course = courses.find(c => c.id === courseId);
                    const progress = student.progress[courseId] || 0;
                    
                    return course ? (
                      <div key={courseId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">{course.title}</span>
                          <span className="text-gray-600">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
