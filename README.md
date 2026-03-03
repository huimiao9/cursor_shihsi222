# Multiplayer Snake Game

A real-time multiplayer snake game built with React, Node.js, and Socket.io.

## Project Structure

- `backend/`: Node.js server with Socket.io for game logic.
- `frontend/`: React application with HTML5 Canvas for rendering.
- `.trae/documents/`: Project documentation (PRD, Tech Architecture).

## How to Run

1.  **Start the Backend**:
    ```bash
    cd backend
    npm start
    ```
    The server will run on `http://localhost:3000`.

2.  **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

3.  **Play**:
    -   Open `http://localhost:5173` in multiple browser tabs/windows.
    -   Enter a name and click "Join Game".
    -   Use Arrow keys or WASD to move.
    -   Eat food (red dots) to grow and increase your score.
    -   Avoid walls, yourself, and other players!

## Features

-   Real-time multiplayer gameplay.
-   Leaderboard showing top 5 players.
-   Game Over screen with "Play Again" option.
-   Smooth rendering with Canvas API.
