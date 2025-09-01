import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const StudentCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // NOTE: You might need to configure axios to send auth tokens for private routes
        const { data } = await axios.get(`/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCourse(data.data.course);
        const completedCount = data.data.completedLectures.length;
        const totalLectures = data.data.course.lectures.length;
        setProgress(
          totalLectures > 0 ? (completedCount / totalLectures) * 100 : 0
        );
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  if (loading)
    return <div className="text-center p-8">Loading course details...</div>;
  if (!course) return <div className="text-center p-8">Course not found.</div>;

  let firstUncompletedFound = false;

  return (
    <div className="w-4/5 mx-auto p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>
        <Link to="/courses" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors flex-shrink-0 ml-4">
          &larr; Back to Courses
        </Link>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-1">
          {Math.round(progress)}% Complete
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Lectures</h2>
        <ul className="space-y-3">
          {course.lectures.map((lecture) => {
            const isLocked = firstUncompletedFound && !lecture.isCompleted;
            if (!lecture.isCompleted && !firstUncompletedFound) {
              firstUncompletedFound = true;
            }

            return (
              <li
                key={lecture._id}
                className={`p-4 rounded-lg flex items-center justify-between ${
                  isLocked ? "bg-gray-200 text-gray-500" : "bg-white shadow-sm"
                }`}
              >
                <div className="flex items-center">
                  {lecture.isCompleted ? (
                    <span className="text-green-500 mr-3">✓</span>
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full mr-3 ${
                        isLocked ? "bg-gray-400" : "bg-indigo-500"
                      }`}
                    ></span>
                  )}
                  <span className="font-medium">{lecture.title}</span>
                </div>
                {!isLocked ? (
                  <Link
                    to={`/courses/${courseId}/lectures/${lecture._id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {lecture.isCompleted ? "Review" : "Start"}
                  </Link>
                ) : (
                  <span className="text-sm">Locked</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default StudentCoursePage;
