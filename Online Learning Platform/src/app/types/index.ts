export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  instructor: string;
  duration: string;
  level: string;
  students: number;
  imageUrl: string;
  price: number;
  category: string;
}

export interface Student {
  // id: string;
  id: number;
  name: string;
  email: string;
  enrolledCourses: number[];
  progress: { [courseId: number]: number };
}
