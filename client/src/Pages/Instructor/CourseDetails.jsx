import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import lectureService from '../../services/lectureService';
import AddLectureForm from '../../Components/AddLectureForm';
import EditCourseForm from '../../Components/EditCourseForm';

const CourseDetails = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null); // Can be a lecture object or `true` for new
  const [isEditingCourse, setIsEditingCourse] = useState(false);

  
  const fetchCourseDetails = async () => {
  try {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setError('You must be logged in to view this page.');
      return;
    }
    const courseData = await courseService.getCourse(courseId, user.token);
    setCourse(courseData.data.course); // ✅ directly set course
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch course details.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleSaveLecture = () => {
    setEditingLecture(null);
    fetchCourseDetails(); // Re-fetch to get the latest list
  };

  const handleCourseSave = () => {
    setIsEditingCourse(false);
    fetchCourseDetails(); // Re-fetch to get the latest list
  };

  const handleDeleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course and all its content?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        await courseService.deleteCourse(courseId, user.token);
        navigate('/dashboard/instructor');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course.');
      }
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        await lectureService.deleteLecture(lectureId, user.token);
        fetchCourseDetails(); // Re-fetch
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lecture.');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-lg font-semibold text-gray-600">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </div>
  );

  if (!course) return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-lg font-semibold text-gray-600">Course not found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {isEditingCourse ? (
          <EditCourseForm
            course={course}
            onSave={handleCourseSave}
            onCancel={() => setIsEditingCourse(false)}
          />
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-gray-900">{course.title}</h2>
              <p className="mt-2 text-gray-600 max-w-2xl whitespace-pre-wrap break-words">{course.description}</p>
            </div>
            <div className="flex flex-shrink-0 space-x-2 mt-4 sm:mt-0">
              <button onClick={() => setIsEditingCourse(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm">Edit Course</button>
              <button onClick={handleDeleteCourse} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm">Delete Course</button>
            </div>
          </div>
        )}
        <hr className="my-6" />

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Lectures</h3>
          {!editingLecture && (
            <button onClick={() => setEditingLecture(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">Add New Lecture</button>
          )}
        </div>

        {editingLecture && (
          <AddLectureForm
            courseId={courseId}
            lectureToEdit={editingLecture === true ? null : editingLecture} // `true` for new, object for edit
            onSave={handleSaveLecture}
            onCancel={() => setEditingLecture(null)}
          />
        )}

        {course.lectures && course.lectures.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {course.lectures.map((lecture) => (
              <li key={lecture._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-800">{lecture.title} <span className="text-sm font-normal text-gray-500">({lecture.type})</span></h4>
                  <div className="flex space-x-2">
                    <button onClick={() => setEditingLecture(lecture)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-1 px-3 rounded-md transition-colors">Edit</button>
                    <button onClick={() => handleDeleteLecture(lecture._id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium py-1 px-3 rounded-md transition-colors">Delete</button>
                  </div>
                </div>
                <div className="mt-4 pl-4 border-l-2 border-gray-200 text-gray-700">
                  {lecture.type === 'reading' ? (
                    // The 'whitespace-pre-wrap' class preserves newlines and wraps text.
                    // The 'break-words' class breaks long words to prevent overflow.
                    <div className="whitespace-pre-wrap break-words text-sm text-gray-800">{lecture.content}</div>
                  ) : (
                    <div className="space-y-4">
                      {lecture.questions.map((q, i) => (
                        <div key={i}>
                          <p className="font-semibold">{i + 1}. {q.text}</p>
                          <ul className="list-disc ml-8 mt-2 space-y-1">
                            {q.answers.map((ans, j) => (
                              <li key={j} className={j === q.correctAnswer ? 'text-green-600 font-bold' : ''}>
                                {ans} {j === q.correctAnswer && ' (Correct)'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-gray-500 italic">No lectures have been added to this course yet.</p>
        )}

        <div className="mt-8">
          <Link to="/dashboard/instructor" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">&larr; Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;