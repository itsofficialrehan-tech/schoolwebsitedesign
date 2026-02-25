// ================= THREE.JS PARTICLE BACKGROUND =================

document.addEventListener("DOMContentLoaded", () => {

  const heroSection = document.getElementById("hero");
  if (!heroSection || typeof THREE === "undefined") return;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    70,
    heroSection.clientWidth / heroSection.clientHeight,
    0.1,
    100
  );
  camera.position.z = 6;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.zIndex = "0";
  renderer.domElement.style.pointerEvents = "none";

  heroSection.style.position = "relative";
  heroSection.appendChild(renderer.domElement);

  // Particles
  const particlesCount = 1200; // reduced for stability
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 16;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.6,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.015;

    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;

    camera.lookAt(scene.position);
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();

  // Resize
  window.addEventListener("resize", () => {
    const w = heroSection.clientWidth;
    const h = heroSection.clientHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

});