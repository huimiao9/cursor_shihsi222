# Product Requirements Document (PRD): Multiplayer Snake Game

## 1. Introduction
This document outlines the requirements for a real-time multiplayer Snake game. The goal is to create a fun, competitive, and visually appealing game where players control snakes, eat food to grow, and try to avoid colliding with walls, themselves, or other players.

## 2. Core Features
### 2.1 Gameplay
- **Multiplayer**: Support for multiple players in the same game instance.
- **Snake Mechanics**:
    -   Snakes move continuously in a grid-based world.
    -   Eating food increases snake length and score.
    -   Colliding with walls, self, or other snakes results in game over for that player.
- **Scoring**: Points are awarded for eating food. A leaderboard displays current scores.
- **Respawn**: Players can rejoin after game over.

### 2.2 User Interface
- **Lobby**: Simple screen to enter a username and join the game.
- **Game Screen**:
    -   Main game area (canvas).
    -   Leaderboard showing player names and scores.
    -   Game over screen with "Play Again" button.
- **Visual Style**: Modern, clean, and responsive design. Dark theme preferred.

## 3. User Stories
- As a player, I want to enter my name and join a game instantly.
- As a player, I want to control my snake using keyboard arrow keys or WASD.
- As a player, I want to see my score and rank compared to other players.
- As a player, I want to see other players' snakes moving in real-time.
- As a player, I want to know when I've lost and have the option to restart.

## 4. Non-Functional Requirements
- **Performance**: Smooth gameplay with minimal latency. 60 FPS rendering on client.
- **Scalability**: Support at least 10 concurrent players in a single room.
- **Compatibility**: Works on modern desktop browsers (Chrome, Firefox, Safari).

## 5. Future Enhancements (Out of Scope for MVP)
- Power-ups (speed boost, shield).
- Multiple game rooms.
- Mobile support (touch controls).
- Chat system.
