const GRID_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

function randomPosition() {
  const x = Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE;
  const y = Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE;
  return { x, y };
}

module.exports = {
  GRID_SIZE,
  WIDTH,
  HEIGHT,
  randomPosition
};
