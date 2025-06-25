# Roomies App

<p>
  <img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB&style=for-the-badge" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-20232A?logo=expo&logoColor=white&style=for-the-badge" alt="Expo" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/CORS-003366?style=for-the-badge" alt="CORS" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" alt="Firebase" />
  <img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white&style=for-the-badge" alt="Jest" />
  <img src="https://img.shields.io/badge/Supertest-4B32C3?style=for-the-badge" alt="Supertest" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white&style=for-the-badge" alt="GitHub Actions" />
</p>

## Roomies™ © 2025 – Gamified Chores for Modern Households

Roomies is a full-stack group project built to showcase our technical and collaborative skills.  
It’s a gamified chores app where users can create groups, assign tasks, and compete on a friendly leaderboard.

Built with **TypeScript**, **React Native (Expo)**, **Tailwind CSS (via NativeWind)**, **Node.js (Express)**, and **Firebase** (Auth, Firestore, Cloud Functions, Emulators, Hosting).

---

## Table of Contents

- [Hosted Version](#hosted-version)
- [Project Summary](#project-summary)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Firebase Setup](#firebase-setup)
- [Linting](#linting)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contact](#contact)

---

## Hosted Version

Frontend (Web): [https://roomies-migration.web.app](https://roomies-migration.web.app)  

🔒 This version is behind authentication.

To fully test the workflow:

1. Create an account and join a group using this group code: JPBVY4.
   You’ll be able to navigate the full single-page application.
   However, you won’t be able to create chores, as you’re not the admin of this group.
   
2. Sign out, then create a new account and create your own group.
   Afterward, add the first user you created to your new group.
   As the admin, you’ll now be able to add chores, assign users, and fully experience the Roomies app.

---

## Project Summary

Roomies lets users:
- Create or join a group
- Assign and complete chores
- Earn points and climb the leaderboard
- Comment on chores and interact with group members

This project demonstrates:
- Full-stack development with **TypeScript**
- Real-time features using **Firebase Auth**, **Firestore**, **Cloud Functions**, **Emulators**
- RESTful API with **Node.js**, **Express**, and **Supertest**
- Modern UI using **React Native**, **Expo**, and **Tailwind CSS (NativeWind)**
- Testing with **Jest** and **Supertest**
- CI/CD via **GitHub Actions**
- Frontend deployment with **Firebase Hosting**

---

## Monorepo Structure

```
Roomies-App/
│
├── roomies-backend/      # Backend (Firebase Functions, API, Firestore rules)
├── roomies-frontend/     # Frontend (React Native, Expo, Web)
├── README.md
└── ...
```

---

## Tech Stack

### 🖼️ Frontend
<p>
  <img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB&style=for-the-badge" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-20232A?logo=expo&logoColor=white&style=for-the-badge" alt="Expo" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge" alt="NativeWind" />
</p>

### ⚙️ Backend
<p>
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/CORS-003366?style=for-the-badge" alt="CORS" />
</p>

### ☁️ Firebase & Hosting
<p>
  <img src="https://img.shields.io/badge/Firebase_Auth-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" alt="Firebase Auth" />
  <img src="https://img.shields.io/badge/Firestore-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" alt="Firestore" />
  <img src="https://img.shields.io/badge/Cloud_Functions-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" alt="Cloud Functions" />
  <img src="https://img.shields.io/badge/Emulators-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" alt="Emulators" />
  <img src="https://img.shields.io/badge/Firebase_Hosting-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" alt="Firebase Hosting" />
</p>

### 🧪 Testing
<p>
  <img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white&style=for-the-badge" alt="Jest" />
  <img src="https://img.shields.io/badge/Supertest-4B32C3?style=for-the-badge" alt="Supertest" />
</p>

### 🛠️ Tooling & DevOps
<p>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=for-the-badge" alt="ESLint" />
  <img src="https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white&style=for-the-badge" alt="Git" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white&style=for-the-badge" alt="GitHub Actions" />
</p>

---

## Getting Started Locally

### 1. Clone & Install

```bash
git clone https://github.com/7doublem/Roomies-App.git
cd Roomies-App
npm install
```

### 2. Install Frontend & Backend Dependencies

```bash
cd roomies-frontend
npm install
cd ../roomies-backend
npm install
```

---

## Firebase Setup

**You must create your own Firebase project for both frontend and backend.**

### 1. Create a Firebase Project

- Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
- Enable Authentication, Firestore, Functions and Emulators as needed.

### 2. Frontend Firebase Config

- In `roomies-frontend/firebase/`, create a file called `firebaseConfig.ts`:
  ```ts
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  export default firebaseConfig;
  ```
- **Do not commit your config.** (It's in `.gitignore`.)

### 3. Backend Firebase Setup

- In `roomies-backend/functions/`, create a `.env` file with your Firebase admin credentials:
  ```
  FIREBASE_PROJECT_ID=your-project-id
  FIREBASE_CLIENT_EMAIL=your-service-account-email
  FIREBASE_PRIVATE_KEY="your-private-key"
  ```
- Use the Firebase CLI to initialize and configure functions and hosting:
  ```bash
  firebase login
  firebase init
  ```

---

## Running the App

### Frontend (Expo)

```bash
cd roomies-frontend
npm run web      # For web
```
IOS and Android coming soon
Open [http://localhost:8081](http://localhost:8081) to view it in the browser.

### Backend (Firebase Functions)

```bash
cd roomies-backend
firebase emulators:start
```
Or deploy to Firebase Functions:
```bash
firebase deploy --only functions
```

---

## Linting

To lint your code:
```bash
npm run lint
```

---

## Deployment

### Frontend (Web)

```bash
cd roomies-frontend
npx expo export --platform web
firebase deploy
```

### Backend

```bash
cd roomies-backend
firebase deploy --only functions
```

---

## API Documentation

- The backend exposes a RESTful API (see `openapi-spec.yml` in `roomies-backend`).
- Example endpoints:
  - `/groups` - Create, join, and manage groups
  - `/chores` - Assign and complete chores
  - `/users` - User management
  - `/comments` - Comment on chores

---

## Contact

**Made By:**  
[Mustafa](https://github.com/7doublem),  
[Viviane](https://github.com/VivianeLVieira),  
[Mel](https://github.com/R3VLver9999),  
[Wendy](https://github.com/WendyBotwe),  
[Suhaim](https://github.com/SuhaimKhalid),  
[Wai](https://github.com/BigSlayWai)

Project Link: [https://github.com/7doublem/Roomies-App](https://github.com/7doublem/Roomies-App)

---
