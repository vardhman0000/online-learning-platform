import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('/api/courses');
        setCourses(data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center p-8">Loading courses...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Available Courses</h1>
        <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors">
          &larr; Back to Home
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
            {course.instructor?.name && (
              <p className="text-sm text-gray-500 mb-2">By {course.instructor.name}</p>
            )}
            <p className="text-gray-600 mb-4">{course.description}</p>
            <Link to={`/courses/${course._id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">
              View Course &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
