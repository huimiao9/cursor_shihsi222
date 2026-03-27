# Technical Architecture Document: Multiplayer Snake Game

## 1. Overview
The system consists of a Node.js backend server handling game logic and state synchronization, and a React frontend for rendering the game and capturing user input. Communication is handled via WebSockets (Socket.io).

## 2. Architecture Diagram
```mermaid
graph TD
    Client[Client (React + Canvas)] <-->|Socket.io (Events)| Server[Server (Node.js + Express)]
    Server -->|Game State Update (60Hz)| Client
    Client -->|Input (Direction Change)| Server
```

## 3. Technology Stack
### 3.1 Frontend
- **Framework**: React (built with Vite).
- **Rendering**: HTML5 Canvas API for high-performance rendering of the game grid.
- **State Management**: React Hooks (useState, useEffect, useRef).
- **Communication**: `socket.io-client`.
- **Styling**: CSS Modules or Styled Components (clean and modular).

### 3.2 Backend
- **Runtime**: Node.js.
- **Framework**: Express (for serving static files and API if needed).
- **Real-time Engine**: `socket.io`.
- **Game Loop**: Server-side interval (e.g., 100ms per tick) to update game state.

## 4. Data Structures
### 4.1 Game State
```javascript
{
  width: 800, // Grid width
  height: 600, // Grid height
  gridSize: 20, // Size of each grid cell
  players: {
    [socketId]: {
      id: String,
      name: String,
      color: String,
      score: Number,
      body: [{ x: Number, y: Number }], // Array of segments
      direction: { x: Number, y: Number }, // Current movement vector
      pendingInputs: [] // Queue of inputs to process next tick
    }
  },
  food: { x: Number, y: Number } // Current food position
}
```

### 4.2 Events
- **Client -> Server**:
    -   `join_game`: { name: String }
    -   `input`: { direction: { x: Number, y: Number } }
    -   `restart`: {}
- **Server -> Client**:
    -   `game_state`: Full game state object (broadcasted periodically).
    -   `game_over`: { score: Number } (sent to specific client).
    -   `leaderboard_update`: Array of top players.

## 5. Implementation Details
### 5.1 Game Loop (Server)
The server runs a `setInterval` loop (e.g., every 100ms):
1.  Process pending inputs for all players.
2.  Update snake positions based on current direction.
3.  Check collisions (walls, self, others).
    -   If collision: Mark player as dead, remove from game, notify client.
4.  Check food consumption.
    -   If eat: Grow snake, increase score, respawn food.
5.  Broadcast updated `game_state` to all connected clients.

### 5.2 Client Rendering
The client uses `requestAnimationFrame` for smooth rendering:
1.  Receive `game_state` from server.
2.  Clear canvas.
3.  Draw grid/background.
4.  Draw food.
5.  Draw all snakes (distinguish local player from others).
6.  Draw UI overlays (score, leaderboard).

### 5.3 Latency Handling
-   **Client Prediction**: (Optional for MVP) Client moves local snake immediately and reconciles with server state. For MVP, we will use simple interpolation or just render server state directly if latency is low.
-   **Input Buffering**: Server processes inputs in order.

## 6. Directory Structure
```
/
├── backend/
│   ├── src/
│   │   ├── game.js      # Game logic class
│   │   ├── server.js    # Entry point, Socket.io setup
│   │   └── utils.js     # Helper functions
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameCanvas.jsx
│   │   │   ├── Lobby.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── package.json (Root for monorepo-like scripts)
```
