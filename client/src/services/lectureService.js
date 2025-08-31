import axios from 'axios';

const COURSE_API_URL = '/api/courses/';
const LECTURE_API_URL = '/api/lectures/';

// Add lecture to a course
const addLecture = async (courseId, lectureData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  // This endpoint is correct: POST /api/courses/:courseId/lectures
  const response = await axios.post(`${COURSE_API_URL}${courseId}/lectures`, lectureData, config);
  return response.data;
};

// Update a specific lecture
const updateLecture = async (lectureId, lectureData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(LECTURE_API_URL + lectureId, lectureData, config);
  return response.data;
};

// Delete a specific lecture
const deleteLecture = async (lectureId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(LECTURE_API_URL + lectureId, config);
  return response.data;
};

const lectureService = {
  addLecture,
  updateLecture,
  deleteLecture,
};

export default lectureService;