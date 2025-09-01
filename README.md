# Learnify - Online Learning Platform

Learnify is a full-stack web application built with the MERN stack, designed to provide a seamless and interactive online learning experience for both students and instructors.

🎥 **Demo Video**: [Watch the demo](https://drive.google.com/file/d/1VPILCXQvqeQaqWcuYPsTOSJSZxffU_-0/view?usp=drive_link)

## Features

### For Students
- **Secure Authentication**: Simple and secure login and signup functionality.
- **Course Browsing**: View a comprehensive catalog of all available courses with titles, descriptions, and instructor names.
- **Personalized Dashboard**: Access enrolled courses and track overall progress.
- **Sequential Learning**: Lectures are unlocked progressively, ensuring a structured and guided learning path.
- **Progress Tracking**: A visual progress bar and completion status provide immediate feedback.
- **Interactive Quizzes**: Test knowledge with quizzes and receive real-time grading and results.

### For Instructors
- **Secure Authentication**: A separate and secure dashboard for managing course content.
- **Course Management**: Easily create, read, update, and delete courses.
- **Lecture Management**: Add, edit, and manage lectures and quizzes within each course.

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **State Management**: React Context API

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm (or yarn)
- MongoDB (a local instance or a cloud service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/vardhman0000/online-learning-platform.git
    cd online-learning-platform
    ```

2.  **Setup the Backend Server:**
    - Navigate to the server directory:
      ```sh
      cd server
      ```
    - Install dependencies:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `server` directory and add the following environment variables:
      ```env
      PORT=4000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_super_secret_jwt_key
      ```
    - Replace the placeholder values with your actual MongoDB connection string and a secure JWT secret.

3.  **Setup the Frontend Client:**
    - From the project root, navigate to the client directory:
      ```sh
      cd ../client
      ```
    - Install dependencies:
      ```sh
      npm install
      ```

### Running the Application

1.  **Start the Backend Server:**
    - From the `server` directory, run:
      ```sh
      npm start
      ```
    - The server will be running on `http://localhost:4000` (or your specified `PORT`).

2.  **Start the Frontend Client:**
    - From the `client` directory, run:
      ```sh
      npm start
      ```
    - The React development server will open the application in your browser at `http://localhost:5173`.
