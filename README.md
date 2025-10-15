# Personal Sprint Planner App

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-61DAFB?logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?logo=appwrite&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-06B6D4?logo=tailwindcss&logoColor=white)

An intuitive mobile application designed for individuals looking to apply Agile sprint methodologies to their personal productivity. This app bridges the gap left by complex, team-oriented tools by providing a lightweight, mobile-first solution for planning, managing, and reflecting on personal sprints. It features a clean Kanban board interface and is built for users who want to track progress and improve their productivity.

## Features

-   **Agile Sprint Planning**: Design and develop a mobile application for personal sprint planning using Agile principles.
-   **Kanban Board Interface**: Manage tasks visually with "To Do", "Doing", and "Done" columns.
-   **Secure Authentication**: Simple and secure user login and signup using email-based OTP.
-   **Automatic Task Carryover**: Incomplete tasks from one sprint are automatically carried over to the next.
-   **Sprint History**: Review completed sprints and associated tasks to reflect on productivity trends.
-   **Cross-Platform & Responsive**: Built with React Native and styled with NativeWind to ensure a seamless experience on both Android and iOS.

## Tech Stack

-   **Frontend**: React Native
-   **Backend**: Appwrite (Authentication, Database)
-   **Styling**: NativeWind
-   **Authentication**: Email OTP via Appwrite Auth
-   **Development Tools**: Visual Studio Code, Android Studio/Xcode
-   **Version Control**: Git & GitHub

## Folder Structure

The project utilizes a feature-driven folder structure powered by Expo Router for clear and scalable navigation.

```
.
├── app/              # Expo Router screens
│   ├── (auth)/       # Authentication routes (login, signin, otp)
│   └── (tabs)/       # Main app routes after login (sprint, history, etc.)
├── assets/           # Static assets like images and fonts
├── components/       # Reusable UI components
├── constants/        # Global constants (colors, styles, etc.)
├── lib/              # Appwrite client configuration
└── ...               # Configuration files (babel.config.js, package.json)
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your development machine:
-   Node.js (LTS version)
-   Git
-   Expo CLI: `npm install -g expo-cli`

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/VinayN3gi/personalSprint.git
    cd personalSprint
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Configure Appwrite:**
    -   Go to [cloud.appwrite.io](https://cloud.appwrite.io/) and create a project.
    -   Ensure your Appwrite project has the necessary databases and collections set up.
    -   Create a `.env` file in the root of the project directory and add the following environment variables:
        ```env
        EXPO_PUBLIC_APPWRITE_PROJECT_ID=
        EXPO_PUBLIC_APPWRITE_PROJECT_NAME=
        EXPO_PUBLIC_APPWRITE_ENDPOINT=
        EXPO_PUBLIC_APPWRITE_DATABASE_ID=
        EXPO_PUBLIC_APPWRITE_SPRINTS_COLLECTION_ID=
        EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID=
        EXPO_PUBLIC_APPWRITE_HISTORY_COLLECTION_ID=
        ```

### Running the App

Start the development server using Expo:

```sh
npx expo start
```

This will open the Expo developer tools. From there, you can:
-   Scan the QR code with the Expo Go app on your Android or iOS device.
-   Press `a` to run on an Android emulator.
-   Press `i` to run on an iOS simulator.

## Join the community

Join our community of developers creating universal apps.

<<<<<<< HEAD
- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Configure Appwrite:**
    -   Go to [cloud.appwrite.io](https://cloud.appwrite.io/) and create a project.
    -   Ensure your Appwrite project has the necessary databases and collections set up.
    -   Create a `.env` file in the root of the project directory and add the following environment variables:
        ```env
        EXPO_PUBLIC_APPWRITE_PROJECT_ID=
        EXPO_PUBLIC_APPWRITE_PROJECT_NAME=
        EXPO_PUBLIC_APPWRITE_ENDPOINT=
        EXPO_PUBLIC_APPWRITE_DATABASE_ID=
        EXPO_PUBLIC_APPWRITE_SPRINTS_COLLECTION_ID=
        EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID=
        EXPO_PUBLIC_APPWRITE_HISTORY_COLLECTION_ID=
        ```

### Running the App

Start the development server using Expo:

```sh
npx expo start
```

This will open the Expo developer tools. From there, you can:
-   Scan the QR code with the Expo Go app on your Android or iOS device.
-   Press `a` to run on an Android emulator.
-   Press `i` to run on an iOS simulator.

## License

This project is distributed under the MIT License. See the `LICENSE` file for more information.
>>>>>>> 1ef41a2 (Update README.md)
