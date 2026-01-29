export interface StudentDashboardDto {
  enrolledCourses: StudentCourseDto[];
  upcomingQuizzes: UpcomingQuizDto[];
  scores: StudentScoreSummaryDto;
}

export interface StudentCourseDto {
  courseId: number;
  title: string;
  progressPercent: number;
  lastLessonTitle?: string;
}

export interface UpcomingQuizDto {
  quizId: number;
  quizTitle: string;
  courseTitle: string;
}

export interface StudentScoreSummaryDto {
  averageScore: number;
  totalAttempts: number;
  passedQuizzes: number;
}
