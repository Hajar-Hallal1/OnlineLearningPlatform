import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { CourseDetails } from './pages/CourseDetails';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
