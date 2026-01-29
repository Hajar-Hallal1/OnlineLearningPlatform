import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  GraduationCap,
  User,
  Settings,
  LogIn,
  UserPlus,
} from "lucide-react";
import { logout } from "../../auth/authService";
import { useNavigate } from "react-router-dom";
export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "Student", "Instructor", "Admin"

  const navItems: { path: string; label: string; icon: any }[] = [
    { path: "/", label: "Home", icon: Home },
  ];

  // Dashboard links based on role
  if (token && role === "Instructor") {
    navItems.push({
      path: "/instructor",
      label: "Instructor Dashboard",
      icon: GraduationCap,
    });
  }
  if (token && role === "Student") {
    navItems.push({ path: "/student", label: "Student Dashboard", icon: User });
  }
  if (token && role === "Admin") {
    navItems.push({ path: "/admin", label: "Admin Dashboard", icon: Settings });
  }
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </Link>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* Login / Register buttons if no token */}
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </> ): (
                
                  <button onClick={handleLogout} className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                   Logout
                  </button>
            )}
              
            
          </div>
        </div>
      </div>
    </nav>
  );
}

