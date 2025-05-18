let score = 0;
let timer = 0;
let found = [];
let interval;

fetch('config.json')
  .then(res => res.json())
  .then(data => initGame(data));

function initGame(config) {
  document.getElementById('title').innerText = config.gameTitle;

  const image1 = document.getElementById('image1');
  const image2 = document.getElementById('image2');
  const canvas1 = document.getElementById('canvas1');
  const canvas2 = document.getElementById('canvas2');

  image1.onload = () => {
    setupCanvas(image1, canvas1);
    attachClick(canvas1, config.differences);
  };
  image2.onload = () => {
    setupCanvas(image2, canvas2);
    attachClick(canvas2, config.differences);
  };

  image1.src = config.images.image1;
  image2.src = config.images.image2;

  interval = setInterval(() => {
    timer++;
    document.getElementById('timer').innerText = `Time: ${timer}s`;
  }, 1000);
}

function setupCanvas(img, canvas) {
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.style.width = img.width + 'px';
  canvas.style.height = img.height + 'px';
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function attachClick(canvas, differences) {
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    for (let i = 0; i < differences.length; i++) {
      const { x: dx, y: dy, width, height } = differences[i];
      if (
        x >= dx && x <= dx + width &&
        y >= dy && y <= dy + height &&
        !found.includes(i)
      ) {
        found.push(i);
        drawCircle(canvas, dx + width / 2, dy + height / 2, Math.max(width, height) / 2);
        score++;
        document.getElementById('score').innerText = score;
        if (score === differences.length) {
          document.getElementById('message').innerText = 'Congratulations! You found all differences!';
          clearInterval(interval);
        }
        break;
      }
    }
  });
}

function drawCircle(canvas, x, y, radius) {
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.stroke();
}