import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Navigation } from "./components/Navigation";
import { Home } from "./pages/Home";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import  CourseDetails  from "./pages/CourseDetails";
import { Toaster } from "./components/ui/sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorCoursePage from "./pages/InstructorCoursePage";

export default function App() {
  const role = localStorage.getItem("role");
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={role === "Admin" ? <AdminDashboard /> : <Navigate to="/" />}/>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route path="/instructor/course/:courseId" element={<InstructorCoursePage />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
