

// rotate + pulse + magnetic + glow + trail + lock-on
// =================================================

const canvas = document.getElementById("cursor-canvas");
const ctx = canvas.getContext("2d");

// ---------- Resize ----------
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ---------- State ----------
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let x = mouseX, y = mouseY;

let rotation = 0;
let targetRotation = 0;
let pulse = 0;

// magnetic
let magnetX = 0;
let magnetY = 0;

// glow
let glow = 0;
let targetGlow = 0;

// HARD LOCK
let lock = 0;            // 0..1
let targetLock = 0;      // 0 or 1

// ---------- HARDCORE TRAIL ----------
const TRAIL_COUNT = 6;
const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x, y, rot: 0 }));

// ---------- Mouse ----------
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ---------- Click Pulse ----------
window.addEventListener("mousedown", () => {
  pulse = 1;
});

// ---------- Hover Targets ----------
document.querySelectorAll(
  "a, button, .facility-banner, .house-banner, .academic-card"
).forEach(el => {

  el.addEventListener("mouseenter", () => {
    targetRotation = Math.PI / 4; // rotate
    targetGlow = 1;               // glow on
    targetLock = 1;               // HARD LOCK engage
  });

  el.addEventListener("mouseleave", () => {
    targetRotation = 0;
    targetGlow = 0;
    targetLock = 0;               // release
    magnetX = 0;
    magnetY = 0;
  });

  el.addEventListener("mousemove", () => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    // stronger snap during lock
    const strength = 0.28 + 0.18 * lock;
    magnetX = (cx - mouseX) * strength;
    magnetY = (cy - mouseY) * strength;
  });
});

// ---------- Draw Helpers ----------
function drawSquare(px, py, rot, alpha, scale, glowPower, tighten = 0) {
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;

  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 2 * scale;

  ctx.shadowColor = "rgba(200,200,255,0.9)";
  ctx.shadowBlur = glowPower;

  const baseSize = (14 - 4 * tighten) * scale; // brackets close-in on lock
  const baseGap  = (7  - 3 * tighten) * scale;

  ctx.beginPath();

  // TL
  ctx.moveTo(-baseGap - baseSize, -baseGap);
  ctx.lineTo(-baseGap, -baseGap);
  ctx.lineTo(-baseGap, -baseGap - baseSize);

  // TR
  ctx.moveTo(baseGap, -baseGap - baseSize);
  ctx.lineTo(baseGap, -baseGap);
  ctx.lineTo(baseGap + baseSize, -baseGap);

  // BR
  ctx.moveTo(baseGap + baseSize, baseGap);
  ctx.lineTo(baseGap, baseGap);
  ctx.lineTo(baseGap, baseGap + baseSize);

  // BL
  ctx.moveTo(-baseGap, baseGap + baseSize);
  ctx.lineTo(-baseGap, baseGap);
  ctx.lineTo(-baseGap - baseSize, baseGap);

  ctx.stroke();
  ctx.restore();
}

function drawLockRing(px, py, alpha, radius) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "rgba(200,200,255,0.9)";
  ctx.shadowBlur = 18;

  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// ---------- Loop ----------
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Smooth follow + magnet
  const tx = mouseX + magnetX;
  const ty = mouseY + magnetY;
  x += (tx - x) * 0.16;
  y += (ty - y) * 0.16;

  // Smooth rotation, glow, lock
  rotation += (targetRotation - rotation) * 0.14;
  glow     += (targetGlow     - glow)     * 0.12;
  lock     += (targetLock     - lock)     * 0.18;

  // Pulse decay
  pulse *= 0.82;

  // ---- Update trail ----
  trail[0].x = x; trail[0].y = y; trail[0].rot = rotation;
  for (let i = trail.length - 1; i > 0; i--) {
    trail[i].x += (trail[i - 1].x - trail[i].x) * 0.35;
    trail[i].y += (trail[i - 1].y - trail[i].y) * 0.35;
    trail[i].rot += (trail[i - 1].rot - trail[i].rot) * 0.35;
  }

  // ---- Draw trail (back → front) ----
  for (let i = trail.length - 1; i >= 0; i--) {
    const t = trail[i];
    const alpha = (i + 1) / (trail.length + 1) * 0.28;
    const scale = 1 - i * 0.08;
    drawSquare(t.x, t.y, t.rot, alpha, scale, 10 * glow, 0);
  }

  // ---- Lock ring (appears & tightens) ----
  if (lock > 0.02) {
    const ringR = 20 - 6 * lock;           // tighten
    drawLockRing(x, y, 0.9 * lock, ringR);
  }

  // ---- Main cursor (tight on lock + pulse) ----
  drawSquare(
    x,
    y,
    rotation,
    1,
    1 + pulse * 0.18,
    24 * glow,
    lock // tighten brackets on lock
  );

  // Center dot
  ctx.beginPath();
  ctx.arc(x, y, 2.5 + pulse * 1.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fill();

  requestAnimationFrame(loop);
}

loop();