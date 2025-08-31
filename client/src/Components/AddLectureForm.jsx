import React, { useState, useEffect } from 'react';
import lectureService from '../services/lectureService';

const AddLectureForm = ({ courseId, lectureToEdit, onSave, onCancel }) => {
  const isEditing = !!lectureToEdit;

  const [lectureType, setLectureType] = useState('Reading');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', answers: ['', ''], correctAnswer: 0 },
  ]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setTitle(lectureToEdit.title);
      setLectureType(lectureToEdit.type);
      if (lectureToEdit.type === 'Reading') {
        setContent(lectureToEdit.content);
      } else {
        setQuestions(lectureToEdit.questions);
      }
    }
  }, [lectureToEdit, isEditing]);

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = aIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', answers: ['', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (qIndex) => {
    const newQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(newQuestions);
  };

  const addAnswer = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push('');
    setQuestions(newQuestions);
  };

  const removeAnswer = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, index) => index !== aIndex);
    if (newQuestions[qIndex].correctAnswer === aIndex) {
      newQuestions[qIndex].correctAnswer = 0;
    } else if (newQuestions[qIndex].correctAnswer > aIndex) {
      newQuestions[qIndex].correctAnswer--;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let lectureData;
    if (lectureType === 'Reading') {
      lectureData = { title, type: 'Reading', content };
    } else {
      for (const q of questions) {
        if (!q.text.trim() || q.answers.some(a => !a.trim()) || q.answers.length < 2) {
          setError('All quiz questions and answers must be filled out, and have at least 2 answers.');
          setLoading(false);
          return;
        }
      }
      lectureData = { title, type: 'Quiz', questions };
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('You must be logged in to add a lecture.');
      }
      if (isEditing) {
        await lectureService.updateLecture(lectureToEdit._id, lectureData, user.token);
      } else {
        await lectureService.addLecture(courseId, lectureData, user.token);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to ${isEditing ? 'update' : 'add'} lecture.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mt-6 shadow-sm">
      <h4 className="text-xl font-bold text-gray-800 mb-4">{isEditing ? 'Edit' : 'Add New'} Lecture</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lecture-type" className="block text-sm font-medium text-gray-700 mb-1">Lecture Type</label>
          <select
            id="lecture-type"
            value={lectureType}
            onChange={(e) => setLectureType(e.target.value)}
            disabled={isEditing} // Do not allow changing type when editing
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="Reading">Reading</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
        <div>
          <label htmlFor="lecture-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            id="lecture-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {lectureType === 'Reading' ? (
          <div>
            <label htmlFor="lecture-content" className="block text-sm font-medium text-gray-700 mb-1">Content (Text or Link)</label>
            <textarea
              id="lecture-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <h5 className="text-lg font-medium text-gray-900">Quiz Questions</h5>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Question {qIndex + 1}</label>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Question text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label className="block text-xs font-medium text-gray-600">Answers:</label>
                  <div className="space-y-2">
                    {q.answers.map((ans, aIndex) => (
                      <div key={aIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`correct-answer-${qIndex}`}
                          checked={q.correctAnswer === aIndex}
                          onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={ans}
                          onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                          placeholder={`Answer ${aIndex + 1}`}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeAnswer(qIndex, aIndex)}
                          className="text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
                          disabled={q.answers.length <= 2}
                          aria-label="Remove answer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addAnswer(qIndex)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Answer</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="w-full flex justify-center py-2 px-4 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Question
            </button>
          </div>
        )}

        {error && <div className="rounded-md bg-red-50 p-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Lecture' : 'Add Lecture'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLectureForm;
