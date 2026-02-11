# PMJ Group Rental Stock Management System

## Setup Instructions

1.  **Install Node.js**: Ensure you have Node.js installed on your system.
2.  **Install Dependencies**: Run `npm install` in your terminal to install all required packages.
3.  **Firebase Setup**:
    -   Create a project at [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Firestore Database**.
    -   Create a web app in the project settings.
    -   Copy the configuration variables.
    -   Create a `.env.local` file in the root directory and add the following:
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        ```
4.  **Run Development Server**: Run `npm run dev` to start the application.

## Structure
-   `app/(public)`: Public facing website.
-   `app/(admin)`: Internal management dashboard.
