import React from 'react';
import { Link } from 'react-router-dom';
// import './LandingPage.css'; // This is no longer needed with Tailwind CSS

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">
            <Link to="/">Learnify</Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/courses" className="font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-300">Courses</Link>
            <Link to="/login" className="font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-300">Log In</Link>
            <Link to="/signup" className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-white text-center py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5">Unlock Your Potential.</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Learn anything, anytime. Explore thousands of courses taught by real-world experts.
            </p>
            <Link to="/courses" className="inline-block bg-indigo-600 text-white font-semibold py-4 px-9 text-lg rounded-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:shadow-indigo-500/40">
              Explore Courses
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-5">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-center gap-10">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center flex-1 max-w-sm hover:-translate-y-1.5 transition-transform duration-300 ease-in-out">
              <div className="text-5xl mb-5 text-indigo-600">🎓</div>
              <h3 className="text-2xl font-semibold mb-2.5">Expert Instructors</h3>
              <p className="text-gray-600 leading-relaxed">Learn from industry leaders who are passionate about teaching.</p>
            </div>
            <div className="bg-white p-10 rounded-lg shadow-lg text-center flex-1 max-w-sm hover:-translate-y-1.5 transition-transform duration-300 ease-in-out">
              <div className="text-5xl mb-5 text-indigo-600">💻</div>
              <h3 className="text-2xl font-semibold mb-2.5">Flexible Learning</h3>
              <p className="text-gray-600 leading-relaxed">Learn at your own pace, with lifetime access on mobile and desktop.</p>
            </div>
            <div className="bg-white p-10 rounded-lg shadow-lg text-center flex-1 max-w-sm hover:-translate-y-1.5 transition-transform duration-300 ease-in-out">
              <div className="text-5xl mb-5 text-indigo-600">📚</div>
              <h3 className="text-2xl font-semibold mb-2.5">Diverse Catalog</h3>
              <p className="text-gray-600 leading-relaxed">Choose from thousands of courses in tech, business, and more.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-gray-300 mt-auto">
        <div className="container mx-auto max-w-6xl py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-5">
            <p>&copy; 2024 Learnify. All rights reserved.</p>
            <div className="flex space-x-6">
            {/* 
                In a real app, you'd use an icon library like react-icons.
                Example: import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
            */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors duration-300">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors duration-300">Facebook</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors duration-300">LinkedIn</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
