// ----- Game State -----
let imagesData = [];
let currentImageIndex = 0;
let playerGuess = null;
let mapEnabled = false;
let totalScore = 0;

// ----- Utility: Shuffle Array -----
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ----- Initialization -----
document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      imagesData = data;
      shuffleArray(imagesData); // Shuffle images on load
      setupCanvas();
      loadImage();
    });

  setupEventListeners();
});

// ----- Setup Canvas Size -----
function setupCanvas() {
  const map = document.getElementById('map');
  const canvas = document.getElementById('line-canvas');
  canvas.width = map.offsetWidth;
  canvas.height = map.offsetHeight;
}

// ----- Load New Image -----
function loadImage() {
  const zoomedImage = document.getElementById('zoomed-image');
  const marker = document.getElementById('marker');
  const realMarker = document.getElementById('real-marker');
  const nextBtn = document.getElementById('next-button');
  const guessBtn = document.getElementById('guess-button');
  const result = document.getElementById('result');
  const canvas = document.getElementById('line-canvas');
  const ctx = canvas.getContext('2d');

  zoomedImage.src = imagesData[currentImageIndex].image;
  document.getElementById('progress').textContent = `Image ${currentImageIndex + 1} of ${imagesData.length}`;
  // Update progress text
document.getElementById('progress').textContent = `Image ${currentImageIndex + 1} of ${imagesData.length}`;

// Update progress bar
const progressPercent = ((currentImageIndex + 1) / imagesData.length) * 100;
document.getElementById('progress-bar-fill').style.width = `${progressPercent}%`;
  playerGuess = null;
  mapEnabled = true;

  marker.style.display = "none";
  realMarker.style.display = "none";
  nextBtn.style.display = "none";
  guessBtn.style.display = "inline-block";
  result.textContent = "";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ----- Setup Event Listeners -----
function setupEventListeners() {
  const map = document.getElementById('map');
  const guessBtn = document.getElementById('guess-button');
  const nextBtn = document.getElementById('next-button');

  map.addEventListener('click', handleMapClick);
  guessBtn.addEventListener('click', handleGuess);
  nextBtn.addEventListener('click', handleNext);
  document.getElementById('restart-button').addEventListener('click', function() {
    // Simple way: reload the page
    location.reload();
  });
}

// ----- Handle Map Click -----
function handleMapClick(e) {
  if (!mapEnabled) return;

  const map = document.getElementById('map');
  const marker = document.getElementById('marker');
  const rect = map.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const x = (clickX / rect.width) * 50;
  const y = (clickY / rect.height) * 50;
  playerGuess = { x, y };

  marker.style.left = `${clickX}px`;
  marker.style.top = `${clickY}px`;
  marker.style.display = "block";
}

// ----- Handle Guess -----
function handleGuess() {
  if (!playerGuess) {
    alert("Click on the map to make a guess first!");
    return;
  }

  const map = document.getElementById('map');
  const realMarker = document.getElementById('real-marker');
  const result = document.getElementById('result');
  const guessBtn = document.getElementById('guess-button');
  const nextBtn = document.getElementById('next-button');
  const canvas = document.getElementById('line-canvas');
  const ctx = canvas.getContext('2d');

  const rect = map.getBoundingClientRect();
  const realLocation = imagesData[currentImageIndex];
  const distance = getDistance(playerGuess.x, playerGuess.y, realLocation.x, realLocation.y);

  // Feedback
  let feedback = distance < 5 ? "🎯 Perfect!" : distance < 15 ? "👍 Close!" : "😅 Far!";
  const pointsEarned = Math.max(0, 100 - distance);  // prevent negative score
  totalScore += pointsEarned;

  result.textContent = `You were ${distance.toFixed(0)} units away! ${feedback}`;
  result.textContent = `You were ${distance.toFixed(0)} units away! ${feedback}`;


  // Show real location
  const realX = (realLocation.x / 50) * rect.width;
  const realY = (realLocation.y / 50) * rect.height;

  realMarker.style.left = `${realX}px`;
  realMarker.style.top = `${realY}px`;
  realMarker.style.display = "block";

  // Draw line
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo((playerGuess.x / 50) * rect.width, (playerGuess.y / 50) * rect.height);
  ctx.lineTo(realX, realY);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 3;
  ctx.stroke();

  mapEnabled = false;
  guessBtn.style.display = "none";
  nextBtn.style.display = "inline-block";

  // Optional: show total score somewhere
  if (document.getElementById('score')) {
    document.getElementById('score').textContent = `Score: ${Math.round(totalScore)}`;
  }
}

// ----- Handle Next -----
function handleNext() {
  currentImageIndex++;

  if (currentImageIndex < imagesData.length) {
    loadImage();
  } else {
    const result = document.getElementById('result');
    result.textContent = " 🎉 Game Over!";
    
function hideElements(ids) {
  ids.forEach(id => document.getElementById(id).style.display = "none");
}

hideElements(["zoomed-image", "map", "line-canvas", "marker", "real-marker", "guess-button", "next-button", "header" , "progress", "progress-bar-fill" , "progress-bar-container"]);
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });

  const restartBtn = document.getElementById('restart-button');
    restartBtn.style.display = "inline-block";

  // Optional: Show final score
  if (document.getElementById('score')) {
    document.getElementById('score').style.display = "block";
  }

  // Optional: Show final score
  if (document.getElementById('score')) {
    document.getElementById('score').style.display = "block";
  }
  }
}

// ----- Utility: Distance Between Two Points -----
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
