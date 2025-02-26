import { createResourceLoader, drawLoadingScreen, playSound, getInput } from './utils.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const { width, height } = canvas;
let lastTime;

const resources = createResourceLoader();

const player = {
  x: width / 2, // center of the screen
  y: height / 2, // center of the screen
  width: width * 0.1, // 10% of the screen width
  height: width * 0.1, // 10% of the screen width
  canPlaySound: true, // have to release the button to play again
  speed: width * 0.0005, // 0.05% of the screen width per millisecond  
};

function update(elapsedTime) {
  // gamepad or keyboard if no gamepad connected
  const [p1] = getInput();
  if (p1.BUTTON_SOUTH.pressed && player.canPlaySound) {
    playSound(resources.sounds.laser);
    player.canPlaySound = false;
  } else if (!p1.BUTTON_SOUTH.pressed) {
    player.canPlaySound = true;
  }

  if (p1.DPAD_LEFT.pressed) {
    player.x -= player.speed * elapsedTime;
  } else if (p1.DPAD_RIGHT.pressed) {
    player.x += player.speed * elapsedTime;
  }

  if (p1.DPAD_UP.pressed) {
    player.y -= player.speed * elapsedTime;
  } else if (p1.DPAD_DOWN.pressed) {
    player.y += player.speed * elapsedTime;
  }
}

function draw() {
  if (!resources.isComplete()) {
    drawLoadingScreen(ctx, resources.getPercentComplete());
    return;
  }
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(resources.images.player, player.x, player.y, player.width, player.width);
}

function gameLoop(time) {
  const deltaTime = time - lastTime;
  update(deltaTime);
  draw();
  lastTime = time;
  requestAnimationFrame(gameLoop);
}

resources.addImage('player', 'images/js.png');
resources.addSound('laser', 'sounds/laser.mp3');

gameLoop();