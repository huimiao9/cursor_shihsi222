import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GameCanvas from './components/GameCanvas';
import './App.css';

const socket = io('http://localhost:3000');

function App() {
  const [gameState, setGameState] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('init', (data) => {
      console.log('Initialized with ID:', data.id);
      setPlayerId(data.id);
    });

    socket.on('game_state', (state) => {
      setGameState(state);
    });

    return () => {
      socket.off('connect');
      socket.off('init');
      socket.off('game_state');
    };
  }, []);

  const handleJoin = () => {
    if (playerName.trim()) {
      socket.emit('join_game', playerName);
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <div className="game-container">
        <h1>Multiplayer Snake</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button onClick={handleJoin}>Join Game</button>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="game-container">
        <h1>Connecting...</h1>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>Multiplayer Snake</h1>
      <GameCanvas socket={socket} gameState={gameState} playerId={playerId} />
      <div className="controls-hint">
        Use Arrow Keys or WASD to move
      </div>
    </div>
  );
}

export default App;
