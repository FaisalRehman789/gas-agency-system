Gas Agency Management System
Project Demo ![Screenshot 2025-06-03 102826](https://github.com/user-attachments/assets/ea83d22c-5654-4576-81e8-a8c10411e95d)



A Firebase-powered web application for online gas cylinder booking with user and admin dashboards.

🔗 Live Demo: https://your-firebase-app.web.app
📂 GitHub Repo: github.com/yourusername/gas-agency-system

📌 Table of Contents
Features

Tech Stack

Setup Guide

Firebase Configuration

Deployment

Screenshots

Contributing

License

✨ Features
👥 User Panel
✅ Registration & Login

📦 Book gas cylinders (PayTM/Cash on Delivery)

📊 View booking history

🔔 Notifications for order updates

🛠 Admin Panel
👨‍💼 Approve/Reject bookings

👥 Manage users

📢 Send notifications

📈 View analytics

🛠 Tech Stack
Category	Technologies
Frontend	HTML, CSS, JavaScript
Backend	Firebase Firestore
Authentication	Firebase Auth (Email/Password)
Hosting	Firebase Hosting
🚀 Setup Guide
Prerequisites
Node.js (v14+)

Firebase CLI (npm install -g firebase-tools)

Installation
Clone the repo

bash
git clone https://github.com/yourusername/gas-agency-system.git
cd gas-agency-system
Install dependencies

bash
npm install  # If using any Node modules
Set up Firebase

Create a project at Firebase Console

Enable Email/Password Authentication and Firestore Database

Configure Firebase

Replace firebaseConfig in /public/js/firebase.js with your project's config:

javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

🔥 Firebase Configuration
Firestore Rules
javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update: if request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    match /bookings/{bookingId} {
      allow read, create: if request.auth != null;
      allow update: if isAdmin() || (request.auth.uid == resource.data.userId);
    }
    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
Create an Admin User
Register a normal user.

In Firestore Console, create an admins collection.

Add a document with the user's UID and admin: true.

🚀 Deployment
Build the project

bash
npm run build  # If using a bundler
Deploy to Firebase

bash
firebase login
firebase init  # Select Hosting and Firestore
firebase deploy
Access your live app
Visit: https://your-project-id.web.app

📸 Screenshots
User Dashboard	Admin Panel
User Dashboard	Admin Panel
🤝 Contributing
Fork the project.

Create a branch (git checkout -b feature/AmazingFeature).

Commit changes (git commit -m 'Add feature').

Push (git push origin feature/AmazingFeature).

Open a Pull Request.

📜 License
Distributed under the MIT License.
See LICENSE for details.

📞 Contact
👤 Faisal Rehman
📧 fa.faisalrahman016@gmail.com
🌐 https://room-portfolio-mu.vercel.app
