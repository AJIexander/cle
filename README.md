# Server Sentinel

This is a Next.js application designed to run on a server for monitoring and management tasks, featuring cloud-based AI to provide powerful recommendations.

## Prerequisites

1.  **Node.js:** Install Node.js (v18 or newer). You can download it from the [official website](https://nodejs.org/). This includes `npm`.
2.  **Git:** Install Git to download the project files. You can get it from [git-scm.com](https://git-scm.com/).

## Setup and Installation

1.  **Get the project files:** If you have Git, open Command Prompt and clone the repository. Otherwise, simply copy the project folder to your server.
    ```cmd
    cd C:\Your\Preferred\Directory
    git clone <your-repository-url>
    cd server-sentinel
    ```
2.  **Install dependencies:**
    ```cmd
    npm install
    ```
    > **Note:** The AI and remote connection functionalities are currently **simulated**. This is because some corporate or firewalled environments may block the installation of necessary `npm` packages. This approach ensures the application runs smoothly everywhere while allowing for full UI and feature development.

3.  **Build the application:** This creates an optimized production build.
    ```cmd
    npm run build
    ```

## Running the Application

A convenience script `start-server.bat` is provided to launch all necessary services.

Simply double-click `start-server.bat` or run it from the Command Prompt in the project's root directory:
```cmd
.\start-server.bat
```
This script will launch the Genkit Service and the Next.js Web Application. Your application will be running at **http://localhost:3000**.
