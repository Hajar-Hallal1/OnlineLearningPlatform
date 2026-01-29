import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, TrendingUp, BookOpen, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Course } from "../types";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface StudentEnrollment {
  studentId: number;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
}



export function InstructorDashboard() {
  const { courses, students, addCourse, setCourses, deleteCourse } = useApp();
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);

  const [studentEnrollments, setStudentEnrollments] = useState<StudentEnrollment[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [myCourses, setMyCourses] = useState<Course[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortdescription: "",
    duration: "",
    level: "Beginner",
    price: "",
    category: "",
    imageUrl: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    shortdescription: "",
    duration: "",
    level: "Beginner",
    price: "",
    category: "",
    imageUrl: "",
  });

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  type Instructor = { id: number; fullName: string; bio: string };
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const addInstructor = (instructor: Instructor) =>
    setInstructors((prev) => [...prev, instructor]);

  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
  const fetchStudentEnrollments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    setLoadingStudents(true);
    try {
      const res = await fetch("https://localhost:7000/api/Instructor/InstructorStudents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to fetch students");
      }

      const data: StudentEnrollment[] = await res.json();
      setStudentEnrollments(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  fetchStudentEnrollments();
}, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    const courseToAdd = {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortdescription,
      duration: formData.duration,
      level: formData.level,
      price: Number(formData.price),
      category: formData.category,
      imageUrl:
        formData.imageUrl ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
    };

    try {
      const response = await fetch(
        "https://localhost:7000/api/Instructor/AddCourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(courseToAdd),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add course");
      }

      const addedCourse = await response.json();

      addCourse({
        id: addedCourse.id,
        title: addedCourse.title,
        description: formData.description,
        shortDescription: addedCourse.shortDescription,
        duration: formData.duration,
        level: formData.level,
        price: addedCourse.price,
        category: addedCourse.category,
        imageUrl: courseToAdd.imageUrl,
        instructor: "You",
        students: 0,
      });

      toast.success("Course added successfully!");
      setIsAddCourseDialogOpen(false);

      setFormData({
        title: "",
        description: "",
        shortdescription: "",
        duration: "",
        level: "Beginner",
        price: "",
        category: "",
        imageUrl: "",
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add course");
    }
  };

  useEffect(() => {
    const fetchMyCourses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You are not logged in");
        return;
      }

      try {
        const response = await fetch(
          "https://localhost:7000/api/Instructor/MyCourses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to load courses");
        }

        const data = await response.json();
        //setCourses(data);
        setMyCourses(data);

        // data.forEach((course: Course) => addCourse(course));
      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
      }
    };

    fetchMyCourses();
  }, []);

  const totalStudents = courses.reduce(
    (sum, course) => sum + course.students,
    0,
  );
  const totalRevenue = courses.reduce(
    (sum, course) => sum + course.students * course.price,
    0,
  );

  //edit a course
  const handleEditCourse = async (e: React.FormEvent, courseId: number) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    const courseToUpdate = {
      title: editFormData.title,
      description: editFormData.description,
      shortDescription: editFormData.shortdescription,
      duration: editFormData.duration,
      level: editFormData.level,
      price: Number(editFormData.price),
      category: editFormData.category,
      imageUrl: editFormData.imageUrl,
    };

    try {
      const response = await fetch(
        `https://localhost:7000/api/Instructor/EditCourse/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(courseToUpdate),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to edit course");
      }

      const updatedCourse = await response.json();

      // Update local state
      setMyCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, ...updatedCourse } : c)),
      );

      toast.success("Course updated successfully!");
      setIsEditCourseDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to edit course");
    }
  };

  //delete a course
  const handleDeleteCourse = async (courseId: number, courseTitle: string) => {
    if (
      !confirm(`Are you sure you want to delete the course "${courseTitle}"?`)
    )
      return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7000/api/Instructor/DeleteCourse/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete course");
      }

      // Remove course from local state
      setMyCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast.success("Course deleted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your courses and monitor student progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Courses
              </CardTitle>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {myCourses.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <Users className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {studentEnrollments.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-1">From all courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Management */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Course Management
            </h2>
            <Dialog
              open={isAddCourseDialogOpen}
              onOpenChange={setIsAddCourseDialogOpen}
            >
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
                        onChange={(e) =>
                          setFormData({ ...formData, level: e.target.value })
                        }
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddCourseDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Course</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog
            open={isEditCourseDialogOpen}
            onOpenChange={setIsEditCourseDialogOpen}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => handleEditCourse(e, editingCourseId!)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Course Title</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      value={editFormData.title}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      value={editFormData.description}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          description: e.target.value,
                        })
                      }
                      required
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Short Description</Label>
                    <Textarea
                      id="edit-shortdescription"
                      name="shortdescription"
                      value={editFormData.shortdescription}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          shortdescription: e.target.value,
                        })
                      }
                      required
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-duration">Duration</Label>
                    <Input
                      id="edit-duration"
                      name="duration"
                      value={editFormData.duration}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          duration: e.target.value,
                        })
                      }
                      required
                      placeholder="e.g., 8 weeks"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-level">Level</Label>
                    <select
                      id="edit-level"
                      name="level"
                      value={editFormData.level}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          level: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Price ($)</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      value={editFormData.price}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      name="category"
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-imageUrl">Image URL (optional)</Label>
                    <Input
                      id="edit-imageUrl"
                      name="imageUrl"
                      value={editFormData.imageUrl}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          imageUrl: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Repeat for shortDescription, duration, level, price, category, imageUrl */}

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditCourseDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <div className="space-y-4">
            {myCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      <Link
                        to={`/instructor/course/${course.id}`}
                        className="hover:underline hover:text-blue-600"
                      >
                        {course.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      by {course.instructor}
                    </p>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCourseId(course.id);
                      setEditFormData({
                        title: course.title,
                        description: course.description,
                        shortdescription: course.shortDescription,
                        duration: course.duration,
                        level: course.level,
                        price: course.price.toString(),
                        category: course.category,
                        imageUrl: course.imageUrl,
                      });
                      setIsEditCourseDialogOpen(true);
                    }}
                  >
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
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Student Management
          </h2>
           {loadingStudents ? (
    <p className="text-gray-500">Loading students...</p>
  ) : studentEnrollments.length === 0 ? (
    <p className="text-gray-500">No students enrolled yet.</p>
  ) : (
    <div className="space-y-4">
      {studentEnrollments.map((student) => (
        <div
          key={student.studentId}
          className="p-4 border border-gray-200 rounded-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                {student.studentName}
              </h3>
              <p className="text-sm text-gray-500">{student.studentEmail}</p>
            </div>
            <div className="text-sm text-gray-600">
              1 course enrolled
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{student.courseTitle}</span>
                {/* <span className="text-gray-600">
                  {student.progress ?? 0}%
                </span> */}
              </div>
              {/* <Progress value={student.progress ?? 0} className="h-2" /> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
          
        </div>
      </div>
    </div>
  );
}
