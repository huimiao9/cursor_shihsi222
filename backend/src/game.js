const { GRID_SIZE, WIDTH, HEIGHT, randomPosition } = require('./utils');

class Game {
  constructor() {
    this.players = {};
    this.food = randomPosition();
    this.leaderboard = [];
  }

  addPlayer(id, name) {
    this.players[id] = {
      id,
      name: name || `Player ${id.substr(0, 4)}`,
      score: 0,
      body: [randomPosition()],
      direction: { x: 0, y: 0 },
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      isDead: false
    };
  }

  removePlayer(id) {
    delete this.players[id];
    this.updateLeaderboard();
  }

  handleInput(id, direction) {
    const player = this.players[id];
    if (!player || player.isDead) return;

    // Prevent 180 degree turns
    if (player.direction.x !== 0 && direction.x === -player.direction.x) return;
    if (player.direction.y !== 0 && direction.y === -player.direction.y) return;

    // Update direction immediately (or buffer it if needed)
    player.direction = direction;
  }

  update() {
    Object.keys(this.players).forEach(id => {
      const player = this.players[id];
      if (player.isDead) return;

      // Move snake
      if (player.direction.x === 0 && player.direction.y === 0) return;

      const head = { ...player.body[0] };
      head.x += player.direction.x * GRID_SIZE;
      head.y += player.direction.y * GRID_SIZE;

      // Check boundary collision
      if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
        player.isDead = true;
        return;
      }

      // Check self collision
      if (player.body.some(segment => segment.x === head.x && segment.y === head.y)) {
        player.isDead = true;
        return;
      }

      // Check collision with other players
      // Note: This is simplified. Collision with other's body kills you.
      // If head-on-head, both die? Or random? Let's say both die for simplicity.
      let collidedWithOther = false;
      Object.keys(this.players).forEach(otherId => {
        if (id === otherId) return;
        const other = this.players[otherId];
        if (other.isDead) return;
        if (other.body.some(segment => segment.x === head.x && segment.y === head.y)) {
          collidedWithOther = true;
        }
      });

      if (collidedWithOther) {
        player.isDead = true;
        return;
      }

      // Move head
      player.body.unshift(head);

      // Check food
      if (head.x === this.food.x && head.y === this.food.y) {
        player.score += 10;
        this.food = randomPosition();
        this.updateLeaderboard();
      } else {
        // Remove tail
        player.body.pop();
      }
    });
  }

  respawnPlayer(id) {
    if (this.players[id]) {
      this.players[id].isDead = false;
      this.players[id].body = [randomPosition()];
      this.players[id].direction = { x: 0, y: 0 };
      this.players[id].score = 0;
      this.updateLeaderboard();
    }
  }

  updateLeaderboard() {
    this.leaderboard = Object.values(this.players)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(p => ({ name: p.name, score: p.score }));
  }

  getState() {
    return {
      players: this.players,
      food: this.food,
      leaderboard: this.leaderboard
    };
  }
}

module.exports = Game;
