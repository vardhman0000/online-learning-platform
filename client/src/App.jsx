import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import CreateCourse from './Pages/Instructor/CreateCourse';
import CourseDetails from './Pages/Instructor/CourseDetails';
import SignupPage from './Pages/SignUpPage';
import InstructorDashboard from './Pages/Instructor/InstructorDashboard';
import ProtectedRoute from './Components/ProtectedRoute';

// You can import other pages like login, signup, etc. here

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Instructor']} />}>
          <Route path="/dashboard/instructor/courses/new" element={<CreateCourse />} />
          <Route path="/dashboard/instructor/courses/:id" element={<CourseDetails />} />
          <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
