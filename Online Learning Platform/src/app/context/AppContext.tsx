import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Course, Student } from "../types";

interface AppContextType {
  courses: Course[];
  students: Student[];
  addCourse: (course: Course) => void;
  setCourses: (courses: Course[]) => void;
  deleteCourse: (courseId: number) => void;
  updateCourse: (courseId: number, updates: Partial<Course>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialStudents: Student[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    enrolledCourses: [1, 2],
    progress: { "1": 65, "2": 42 },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    enrolledCourses: [1, 3, 4],
    progress: { "1": 80, "3": 55, "4": 90 },
  },
  {
    id: 3,
    name: "Robert Brown",
    email: "robert.brown@example.com",
    enrolledCourses: [2, 5],
    progress: { "2": 30, "5": 75 },
  },
  {
    id: 4,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    enrolledCourses: [3, 6],
    progress: { "3": 95, "6": 20 },
  },
  {
    id: 5,
    name: "David Martinez",
    email: "david.martinez@example.com",
    enrolledCourses: [1, 4, 5],
    progress: { "1": 45, "4": 60, "5": 38 },
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  // const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students] = useState<Student[]>(initialStudents);

  useEffect(() => {
    fetch("https://localhost:7000/api/Courses")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        return res.json();
      })
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
  }, []);

  const addCourse = async (course: Course) => {
    const res = await fetch("https://localhost:7000/api/Courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });

    if (!res.ok) {
      throw new Error("Failed to add course");
    }

    const createdCourse = await res.json();
    setCourses((prev) => [...prev, createdCourse]);
  };

  const deleteCourse = (courseId: number) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  const updateCourse = (courseId: number, updates: Partial<Course>) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, ...updates } : course,
      ),
    );
  };

  return (
    <AppContext.Provider
      value={{ courses, students, addCourse, setCourses, deleteCourse, updateCourse }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
// const initialCourses: Course[] = [
//   {
//     id: '1',
//     title: 'Complete Web Development Bootcamp',
//     description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from scratch. Build real-world projects and become a full-stack developer.',
//     instructor: 'Sarah Johnson',
//     duration: '12 weeks',
//     level: 'Beginner',
//     students: 1234,
//     imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
//     price: 89.99,
//     category: 'Web Development'
//   },
//   {
//     id: '2',
//     title: 'Advanced React & TypeScript',
//     description: 'Master React with TypeScript, learn advanced patterns, state management, and build production-ready applications.',
//     instructor: 'Michael Chen',
//     duration: '8 weeks',
//     level: 'Advanced',
//     students: 856,
//     imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
//     price: 129.99,
//     category: 'Web Development'
//   },
//   {
//     id: '3',
//     title: 'Python for Data Science',
//     description: 'Learn Python programming, data analysis with Pandas, visualization with Matplotlib, and machine learning basics.',
//     instructor: 'Dr. Emily Rodriguez',
//     duration: '10 weeks',
//     level: 'Intermediate',
//     students: 2341,
//     imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop',
//     price: 99.99,
//     category: 'Data Science'
//   },
//   {
//     id: '4',
//     title: 'UI/UX Design Masterclass',
//     description: 'Master user interface and user experience design. Learn Figma, Adobe XD, and design thinking principles.',
//     instructor: 'Alex Turner',
//     duration: '6 weeks',
//     level: 'Beginner',
//     students: 1567,
//     imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
//     price: 79.99,
//     category: 'Design'
//   },
//   {
//     id: '5',
//     title: 'Mobile App Development with React Native',
//     description: 'Build cross-platform mobile applications for iOS and Android using React Native and Expo.',
//     instructor: 'James Wilson',
//     duration: '9 weeks',
//     level: 'Intermediate',
//     students: 987,
//     imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
//     price: 109.99,
//     category: 'Mobile Development'
//   },
//   {
//     id: '6',
//     title: 'Machine Learning with Python',
//     description: 'Deep dive into machine learning algorithms, neural networks, and AI. Build predictive models from scratch.',
//     instructor: 'Dr. Priya Sharma',
//     duration: '14 weeks',
//     level: 'Advanced',
//     students: 1876,
//     imageUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=500&fit=crop',
//     price: 149.99,
//     category: 'Machine Learning'
//   }
// ];
