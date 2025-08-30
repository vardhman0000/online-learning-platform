import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student', // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let response;
    try {
      response = await fetch('/api/auth/register', { // Make sure this endpoint is correct
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create an account. Please try again.');
      }

      // On successful signup, redirect the user to the login page.
      console.log('Signup successful:', data);
      navigate('/login'); // Redirect to login page after signup

    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error('JSON Parse Error: The server response was not valid JSON.');
        const responseText = response ? await response.text() : 'No response from server.';
        console.error('Server Response Text:', responseText);
        setError('An unexpected error occurred. Please try again.');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors duration-300" aria-label="Go back to homepage">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Start your learning journey with us today.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input id="name" name="name" type="text" autoComplete="name" required value={formData.name} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">I am signing up as a...</label>
            <div className="mt-2 flex items-center justify-around rounded-md border border-gray-300 p-1">
              <label className={`w-1/2 cursor-pointer rounded-md py-2 text-center text-sm font-medium transition-colors duration-200 ${formData.role === 'Student' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <input type="radio" name="role" value="Student" checked={formData.role === 'Student'} onChange={handleChange} className="sr-only" />
                Student
              </label>
              <label className={`w-1/2 cursor-pointer rounded-md py-2 text-center text-sm font-medium transition-colors duration-200 ${formData.role === 'Instructor' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <input type="radio" name="role" value="Instructor" checked={formData.role === 'Instructor'} onChange={handleChange} className="sr-only" />
                Instructor
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.password} onChange={handleChange}
                className="w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A10.025 10.025 0 01.458 10c1.274 4.057 5.022 7 9.542 7 1.852 0 3.576-.468 5.068-1.27l-1.18-1.182z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;