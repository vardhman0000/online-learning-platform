import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LecturePage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const { data } = await axios.get(`/api/lectures/${lectureId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("LOGGING DATA : ",data.data);

        setLecture(data.data);
      } catch (error) {
        console.error("Error fetching lecture:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLecture();
  }, [lectureId]);

  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      await axios.post(
        `/api/lectures/${lectureId}/complete`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error(
        "Error marking as complete:",
        error.response?.data || error.message
      );
    }
  };

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      })
    );

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `/api/lectures/${lectureId}/quiz/submit`,
        { courseId, answers: formattedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuizResult(data.data);
    } catch (error) {
      console.error(
        "Error submitting quiz:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) return <div className="text-center p-8">Loading lecture...</div>;
  if (!lecture)
    return <div className="text-center p-8">Lecture not found.</div>;

  return (
    <div className="container w-4/5 mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">{lecture.title}</h1>

      {lecture.type === "reading" && (
        <div>
          <div className="prose max-w-none bg-white p-6 rounded-lg shadow-md">
            {lecture.content}
          </div>
          <button
            onClick={handleMarkComplete}
            className="mt-6 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Mark as Complete & Continue
          </button>
        </div>
      )}

      {lecture.type === "quiz" && !quizResult && (
    
        <form
          onSubmit={handleSubmitQuiz}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          {lecture.questions.map((q, index) => (
            <div key={q._id} className="mb-6">
              <p className="font-semibold mb-2">
                {index + 1}. {q.text}
              </p>
              <div className="space-y-2">
                {q.answers.map((ans, optIndex) => (
                  <label
                    key={optIndex}
                    className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={q._id}
                      value={optIndex}
                      onChange={() => handleOptionChange(q._id, optIndex)}
                      className="mr-3"
                      required
                    />
                    {ans}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Submit Quiz
          </button>
        </form>
      )}

      {quizResult && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-bold mb-4">Quiz Result</h2>
          <p className="text-lg">
            Your score:{" "}
            <span className="font-bold">
              {quizResult.score} / {quizResult.totalQuestions} (
              {quizResult.percentage.toFixed(2)}%)
            </span>
          </p>
          {quizResult.passed ? (
            <div className="mt-4">
              <p className="text-green-600 font-semibold">
                Congratulations, you passed!
              </p>
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                Continue to Next Lecture
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-red-600 font-semibold">
                You did not pass. Please try again.
              </p>
              <button
                onClick={() => {
                  setQuizResult(null);
                  setAnswers({});
                }}
                className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors"
              >
                Retry Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LecturePage;
