// src/types/InstructorStatsDto.ts
export interface InstructorStatsDto {
  id: string;
  fullName: string;
  email: string;
  totalCourses: number;
  totalStudents: number;
  quizAverageScore: number;
  topQuizTitle: string;
  lowQuizTitle?: string;
}
