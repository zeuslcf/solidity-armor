# **App Name**: Solidity Armor

## Core Features:

- File Upload: Allow authenticated users to upload .sol files to Cloudflare R2 object storage.
- Smart Contract Analysis: Analyze uploaded smart contracts using a google gemini ai (make sure to provide the cloudflare r2 file url to the ai so it can read it and analyse it), downloading the contract from Cloudflare R2 object storage and sending results back to Firestore.
- Vulnerability Report: Display a detailed report of identified vulnerabilities, including risk scores and severity levels, pulled from Firestore.
- AI-Powered Fix Suggestions: Provide AI-generated suggestions for fixing identified vulnerabilities using a tool that helps to reason and incorporate information for suggested fixes.
- Operation Management: Handle user operations (for each file upload and smart contract analysis) and charge the user a fee from their wallet and make sure the transaction passed before starting to do the analysis if the transaction fails then the analysis won't start.
- User Authentication: Implement user sign-in using Wagmi for Ethereum sign-in, storing user data in Firestore (each user will be identified with his unique wallet address).
- Scan History Dashboard: Provide a user dashboard displaying a list of previous scans with their status and risk summary, fetched from Firestore.

## Style Guidelines:

- Primary color: Strong blue (#29ABE2) for trust and security, drawing from concepts of technological audits.
- Background color: Light gray (#F0F4F7), visibly of the same hue as the primary color, but heavily desaturated to provide a neutral backdrop.
- Accent color: Green (#90EE90), an analogous color, but of significantly different brightness and saturation for clear calls to action.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined look, suitable for both headlines and body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use security-themed icons to represent different vulnerability types and scan statuses.
- Subtle loading animations during the smart contract analysis process.