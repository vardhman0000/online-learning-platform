import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import courseService from "../../services/courseService";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      // Optionally, redirect to login page after a delay
      // setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const parsedUser = JSON.parse(loggedInUser);

    // This is the crucial check. If the token is missing, we stop.
    if (!parsedUser.token) {
      setError("Authentication error: User session is missing a token.");
      setLoading(false);
      return;
    }

    setUser(parsedUser);

    const fetchCourses = async () => {
      try {
        const responseData = await courseService.getCourses(parsedUser.token);

        // The API might return the array of courses directly, or it might be
        // wrapped in an object like { success: true, data: [...] }.
        // This check handles both cases to prevent a crash.
        const coursesArray = Array.isArray(responseData) ? responseData : responseData.data;

        if (Array.isArray(coursesArray)) {
          setCourses(coursesArray);
        } else {
          console.error('Received data is not an array:', responseData);
          setError('Failed to load courses: Unexpected data format from server.');
        }
      } catch (err) {
        // Handle cases where the token is invalid or expired on the server
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Your session is invalid or has expired. Please log out and log in again.");
        } else {
          setError(err.response?.data?.error || "Failed to fetch courses.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); // Changed dependency to [] to run only once on mount

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Instructor Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:block">Welcome, {user?.name}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
              <Link to="/dashboard/instructor/courses/new" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
                Create New Course
              </Link>
            </div>

            <div className="mt-4">
              {courses.length > 0 ? (
                <ul className="space-y-4">
                  {courses.map((course) => (
                    <li key={course._id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Link to={`/dashboard/instructor/courses/${course._id}`} className="font-medium text-indigo-600 hover:underline">
                        {course.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-gray-500">You have not created any courses yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
