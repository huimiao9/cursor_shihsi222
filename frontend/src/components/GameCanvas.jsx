import { useEffect, useRef } from 'react';

const GameCanvas = ({ socket, gameState, playerId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    const { players, food, width, height } = gameState;
    const GRID_SIZE = 20; // Hardcoded for simplicity, or pass from prop

    // Clear canvas
    ctx.fillStyle = '#242424';
    ctx.fillRect(0, 0, width, height);

    // Draw grid (optional, for visual aid)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff0055';
    ctx.beginPath();
    ctx.arc(food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw players
    Object.values(players).forEach(player => {
      if (player.isDead) return;

      ctx.fillStyle = player.color;
      player.body.forEach((segment, index) => {
        const isHead = index === 0;
        
        // Draw body segment
        ctx.fillRect(segment.x + 1, segment.y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
        
        // Draw eyes for head
        if (isHead) {
          ctx.fillStyle = '#fff';
          // Simple eyes
          const eyeSize = 4;
          const eyeOffset = 5;
          // Determine eye position based on direction (simplified)
          ctx.fillRect(segment.x + eyeOffset, segment.y + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(segment.x + GRID_SIZE - eyeOffset - eyeSize, segment.y + eyeOffset, eyeSize, eyeSize);
          
          // Draw name above head
          ctx.fillStyle = '#fff';
          ctx.font = '12px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(player.name, segment.x + GRID_SIZE / 2, segment.y - 5);

          // Reset fill style for next segment (if needed, though we set it at start of loop)
          ctx.fillStyle = player.color;
        }
      });
    });

  }, [gameState, playerId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let direction = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          direction = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          direction = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          direction = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          direction = { x: 1, y: 0 };
          break;
        default:
          break;
      }

      if (direction) {
        socket.emit('input', direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [socket]);

  return (
    <div className="canvas-wrapper">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        style={{ display: 'block' }}
      />
      
      {/* Leaderboard Overlay */}
      <div className="leaderboard">
        <h3>Leaderboard</h3>
        <ul>
          {gameState.leaderboard.map((p, i) => (
            <li key={i}>
              <span>{i + 1}. {p.name}</span>
              <span>{p.score}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Game Over Overlay for current player */}
      {gameState.players[playerId]?.isDead && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #ff0055'
        }}>
          <h2>Game Over</h2>
          <p>Score: {gameState.players[playerId].score}</p>
          <button onClick={() => socket.emit('respawn')}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
