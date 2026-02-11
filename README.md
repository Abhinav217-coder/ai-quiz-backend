Features

AI-generated quizzes using Groq API

Real-time multiplayer quiz rooms

Live leaderboard and score tracking

Room creation and join functionality

Responsive frontend UI

Automated question generation

Timer-based quiz sessions

# Stack

Frontend

React

Bootstrap

HTML, CSS, JavaScript

Backend

Django

Django REST Framework

WebSockets (Django Channels)

AI Integration

Groq API (Quiz generation)

Database

SQLite / MySQL (based on your setup)

Tools

Git

VS Code

Installation & Setup
1️ Clone Repository

git clone https://github.com/yourusername/quiz-project.git

cd quiz-project

2️ Backend Setup (Django)

cd backend

python -m venv venv

source venv/bin/activate 

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver

#frontend setup

cd frontend

npm install

npm start


4️ Configure Environment Variables

Create .env file:


GROQ_API_KEY=your_api_key_here


the user authentication is not actually completed and iam working on it 

![Quiz Screenshot](Screenshot%202026-02-11%20164736.png)


WHEN USER JOINS LOBBY 


![Quiz Screenshot](LOBBY.png)


IMAGE OF JOIN PAGE

![Quiz Screenshot](join%20room.png)


