import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import CreateCourse from './Pages/Instructor/CreateCourse';
// import CourseDetails from './Pages/Instructor/CourseDetails';
import SignupPage from './Pages/SignupPage';
import InstructorDashboard from './Pages/Instructor/InstructorDashboard';
import ProtectedRoute from './Components/ProtectedRoute';

// Instructor Pages
import InstructorCourseDetails from './Pages/Instructor/CourseDetails';

// Student Pages
import CoursesPage from './Pages/Student/CoursesPage';
import StudentCoursePage from './Pages/Student/StudentCoursePage';
import LecturePage from './Pages/Student/LecturePage';

// You can import other pages like login, signup, etc. here

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Instructor']} />}>
          <Route path="/dashboard/instructor/courses/new" element={<CreateCourse />} />
          <Route path="/dashboard/instructor/courses/:id" element={<InstructorCourseDetails />} />
          <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
        </Route>

        {/* Student Routes */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<StudentCoursePage />} />
        <Route path="/courses/:courseId/lectures/:lectureId" element={<LecturePage />} />

      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
