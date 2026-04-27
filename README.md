**AI Quiz Application**

**Overview**
This project is an AI-based quiz application where users can register, generate quizzes using a topic, attempt them, and view their scores with answer review.

**Tech Stack**
Frontend: React.js
Backend: Node.js (Express)
Database: PostgreSQL
AI Integration: Google Gemini API
Deployment: Vercel (Frontend)

**How to Run Locally**

**Backend**
- cd backend
- npm install
- node index.js

**Frontend**
- cd frontend
- npm install
- npm start

**Database Design**
I used PostgreSQL and created a simple users table for authentication:

- id (primary key)
- name
- email
- password

- Since time was limited, I focused only on user authentication.
- I planned to add quiz history tables later.

**API Structure**

Auth APIs
- POST /register → create new user
- POST /login → login user
- Quiz API
- POST /quiz
- Input: topic, difficulty
- Output: generated MCQ questions

- This API uses Gemini AI to generate questions.
- If AI fails, fallback questions are returned to avoid breaking the app.

**Challenges Faced**

1. AI Response Issues
AI was not always returning valid JSON
I solved this by cleaning the response and adding fallback questions

2. Deployment Issues
Faced multiple errors while deploying frontend (build issues, permissions)
Fixed using:
--legacy-peer-deps
adjusting build commands
handling permission issues

3. Git Issues
Faced submodule issue with frontend folder
Resolved by creating a clean repo and pushing again

**Features Implemented**
User Registration & Login
AI-based quiz generation
Topic-based quiz
Difficulty selection
Answer selection and score calculation
Review answers (correct/wrong)

**Features Not Implemented**

- Number of questions
- Quiz history
- Progress tracking
These require additional database design and more time, so I focused on completing the core flow first.

**My Approach**

I focused on:

- Making the core flow work end-to-end
- Ensuring the app doesn’t crash (fallback handling)
- Keeping the UI simple and usable

**Links**
GitHub: https://github.com/RishikaV303/quiz-ai.git
Live App: https://quiz-ai-omega-lyart.vercel.app/
