# IdeaVerse

IdeaVerse is a research idea generation platform that allows users to create, manage, and execute code based on their research ideas. The application provides a user-friendly interface for uploading code files, generating new code from scratch, and viewing results in a structured format.
[Live Demo](https://ideaverse-frontend.vercel.app/)

## Features

- **Research Idea Generation**: Generate research ideas based on user input.
- **Code Generation**: Automatically generate code based on the uploaded files or research ideas.
    - **Code Upload**: Upload base code files in supported formats (.py, .ipynb).
    - **Code Generation From Scratch**: Generate whole code from scratch based on the given prompt/idea.
    - **Results Display**: View generated code and execution results in a structured format (json).
- **Research Paper Generation**: Generate the whole research paper in proper formats
- **User Authentication**: Secure login to access personalized features.

## Installation

To get started with IdeaVerse, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IdeaVerseApp/idea-generation.git
   cd ideaverse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_API_ENDPOINT=your_api_endpoint
   ```
   (By default add - https://code-runner-backend-wxfd.onrender.com (backend hosted on render))

4. **Run the application**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Features - Code Generation
- **Pre-Requisite**: There should be a generated idea before proceeding to code generation
- **Upload Code**: Click on the "PROVIDE THE BASE CODE TEMPLATE" button to upload your code files.
OR
- **Generate From Scratch**: Click on "GENERATE FROM SCRATCH" to generate the whole code from scratch
- **Generate Code**: After uploading, you can generate code based on your research idea or the uploaded file.
- **View Results**: Navigate to the results page to see the generated code through Aider.
**Aider** is an AI-powered code generation tool that assists users in creating, modifying, and executing code based on user-defined prompts and existing code files. It streamlines the coding process by automating repetitive tasks and providing intelligent suggestions tailored to the user's needs.
- **Run Code**: Run the generated code on our docker environment or uplaod your own results in json format

## Project Directory Overview

The project directory is structured as follows:
/ideaverse
├── /app            # Main application pages and routes
├── /components     # Reusable React components
├── /context        # Context API for state management
├── /pages          # Next.js pages for routing
├── /public         # Static files like images and icons
├── /styles         # Global styles and CSS modules
├── /utils          # Utility functions and helpers
├── .env            # Environment variables
├── package.json    # Project metadata and dependencies
├── README.md       # Project documentation
└── next.config.js  # Next.js configuration file
