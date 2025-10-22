# Solidity Armor

Solidity Armor is an AI-powered smart contract vulnerability scanner built with Next.js and Firebase. It provides a secure, immersive, and user-friendly platform for web3 developers to analyze their Solidity code for potential security risks.

The application leverages Google's generative AI (via Genkit) to perform deep code analysis, identify vulnerabilities, and even suggest fixes, making it an essential tool for securing decentralized applications.

## ✨ Features

- **AI-Powered Vulnerability Scanning**: Analyzes Solidity smart contracts for a wide range of security vulnerabilities using advanced AI models.
- **Multiple Input Methods**: Scan contracts by either uploading a `.sol` file or providing a public URL (e.g., from GitHub).
- **Web3 Integration**: Users connect with their Ethereum wallet to log in and pay for scans.
- **Transaction-Based Service**: Charges a small ETH fee for each contract analysis.
- **Real-Time Dashboard**: A dynamic dashboard that shows the user's scan history and the live status of ongoing analyses.
- **Comprehensive Reporting**: Generates detailed vulnerability reports with risk scores, severity levels, and an AI-generated summary.
- **AI-Generated Fixes**: Offers actionable, AI-generated code snippets to help developers remediate identified vulnerabilities.
- **Exportable Reports**: Clean, professional reports that can be printed or saved as a PDF for sharing and record-keeping.
- **Secure by Design**: User data is isolated and protected with robust Firebase Security Rules, ensuring privacy and data integrity.
- **Modern & Futuristic UI**: A polished user interface built with ShadCN UI and Tailwind CSS for a great user experience.

## 🛠️ Technology Stack

- **Framework**: Next.js (with App Router)
- **Styling**: Tailwind CSS & ShadCN UI
- **Generative AI**: Google AI via Genkit
- **Backend & Database**: Firebase (Firestore, Firebase Authentication)
- **Web3**: Wagmi & Viem for wallet interactions

## 🚀 Getting Started

The application is configured to work out-of-the-box in a Firebase Studio environment.

1.  **Connect Wallet**: The main entry point is the landing page (`src/app/page.tsx`), where users are prompted to connect their wallet.
2.  **Dashboard**: After connecting, the user is redirected to the dashboard (`src/app/dashboard/page.tsx`).
3.  **Start a Scan**: On the dashboard, users can start a new scan by uploading a contract or providing a URL.
4.  **View Reports**: Completed scans can be viewed from the scan history, leading to the detailed report page (`src/app/scan/[id]/page.tsx`).

## 🔐 Security

Security is a core principle of this application.
- **Data Isolation**: All user data, including scans and reports, is stored under a path unique to their Firebase UID.
- **Firestore Security Rules**: The `firestore.rules` file enforces strict data ownership, preventing any user from accessing another user's data.
- **Privacy**: The user's wallet address is not stored in the database to protect user privacy. Authentication is handled via Firebase's secure UID system.