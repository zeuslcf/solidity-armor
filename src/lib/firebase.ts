// This is a mock Firebase configuration.
// In a real application, you would replace this with your actual Firebase config.

const firebaseConfig = {
  apiKey: "AIzaSyB...-placeholder",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};

// Mock functions to simulate Firebase services like Firestore and Storage.
// In a real app, you would initialize these services here.
// e.g., import { initializeApp } from "firebase/app";
// e.g., import { getFirestore } from "firebase/firestore";
//
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

console.log("Mock Firebase initialized. Use `src/lib/data.ts` for data simulation.");

export {};
