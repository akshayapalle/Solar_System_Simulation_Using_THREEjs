import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getPlanet from "./src/getPlanet.js";
import getSun from "./src/getSun.js";
import getStarfield from "./src/getStarfield.js";
import getElipticLines from "./src/getElipticLines.js";
import getAsteroidBelt from "./src/getAsteroidBelt.js";

// 📦 Scene & Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

// 🌀 Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 🌞 Sun
const sunTexture = new THREE.TextureLoader().load("./textures/sunmap.jpg");
const sun = getSun(sunTexture);
sun.name = "Sun";
scene.add(sun);

// 💡 Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// 🌌 Starfield
let stars = getStarfield();
scene.add(stars);

// 🌍 Planets Data
const planetData = [
  { name: "mercury", size: 0.1, distance: 1.2, speed: 0.04 },
  { name: "venus", size: 0.15, distance: 1.6, speed: 0.02 },
  { name: "earth", size: 0.2, distance: 2.0, speed: 0.01 },
  { name: "mars", size: 0.18, distance: 2.4, speed: 0.008 },
  { name: "jupiter", size: 0.35, distance: 3.0, speed: 0.004 },
  { name: "saturn", size: 0.3, distance: 3.6, speed: 0.0035 },
  { name: "uranus", size: 0.25, distance: 4.2, speed: 0.002 },
  { name: "neptune", size: 0.25, distance: 4.8, speed: 0.0015 },
];

// 🪐 Planet Generation
const planets = planetData.map((data) => {
  let planet;

  if (data.name === "earth") {
    planet = getPlanet({
      name: "earth",
      folder: "earth",
      size: data.size,
      distance: data.distance,
      speed: data.speed,
      map: "00_earthmap1k.jpg",
      bump: "01_earthbump1k.jpg",
      specular: "02_earthspec1k.jpg",
      lights: "03_earthlights1k.jpg",
      clouds: "05_earthcloudmap.jpg",
    });
  } else if (data.name === "mercury") {
    planet = getPlanet({
      name: "mercury",
      folder: "mercury",
      size: data.size,
      distance: data.distance,
      speed: data.speed,
      map: "mercurymap.jpg",
      bump: "mercurybump.jpg",
    });
  } else if (data.name === "venus") {
    planet = getPlanet({
      name: "venus",
      folder: "venus",
      size: data.size,
      distance: data.distance,
      speed: data.speed,
      map: "venusmap.jpg",
      bump: "venusbump.jpg",
    });
  } else if (data.name === "saturn") {
    const ringTex = new THREE.TextureLoader().load("./textures/saturn/saturnringcolor.jpg");
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.75, 64),
      new THREE.MeshBasicMaterial({ map: ringTex, side: THREE.DoubleSide, transparent: true })
    );
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.001;

    planet = getPlanet({
      name: "saturn",
      folder: "saturn",
      map: "saturnmap.jpg",
      size: data.size,
      distance: data.distance,
      speed: data.speed,
      children: [ringMesh],
    });
  } else if (data.name === "uranus") {
    const ringTex = new THREE.TextureLoader().load("./textures/uranus/uranusringtrans.gif");
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.5, 64),
      new THREE.MeshBasicMaterial({ map: ringTex, side: THREE.DoubleSide, transparent: true })
    );
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.001;

    planet = getPlanet({
      name: "uranus",
      folder: "uranus",
      map: "uranusmap.jpg",
      size: data.size,
      distance: data.distance,
      speed: data.speed,
      children: [ringMesh],
    });
  } else {
    planet = getPlanet({
      name: data.name,
      img: `${data.name}.png`,
      size: data.size,
      distance: data.distance,
      speed: data.speed,
    });
  }

  planet.userData.name = data.name;
  planet.userData.mesh = planet.children[0];
  planet.userData.mesh.userData.planetGroup = planet;
  scene.add(planet);
  return planet;
});

// 🌀 Orbit Rings
scene.add(getElipticLines());

// 🪨 Asteroids
new THREE.LoadingManager().onLoad = () => {
  scene.add(getAsteroidBelt([]));
};

// 🎛️ UI Panel
const panel = document.createElement("div");
Object.assign(panel.style, {
  position: "absolute",
  top: "10px",
  left: "10px",
  padding: "10px",
  background: "rgba(0,0,0,0.5)",
  color: "#fff",
  fontFamily: "sans-serif",
  maxHeight: "90vh",
  overflowY: "auto",
  zIndex: 999,
});
document.body.appendChild(panel);

planets.forEach((planet) => {
  const label = document.createElement("label");
  label.textContent = planet.userData.name + ": ";
  label.style.display = "block";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0.001;
  slider.max = 0.05;
  slider.step = 0.001;
  slider.value = planet.userData.speed;
  slider.style.width = "100px";
  slider.oninput = () => (planet.userData.speed = parseFloat(slider.value));

  panel.appendChild(label);
  panel.appendChild(slider);
});

// ⏯️ Pause Button
let isPaused = false;
const pauseBtn = document.createElement("button");
pauseBtn.textContent = "Pause";
pauseBtn.onclick = () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
};
panel.appendChild(pauseBtn);

// 🌗 Mode Toggle
let isDarkMode = true;
const modeBtn = document.createElement("button");
modeBtn.textContent = "Switch to Light Mode";
modeBtn.onclick = () => {
  isDarkMode = !isDarkMode;
  modeBtn.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
  scene.remove(stars);
  scene.background = isDarkMode ? null : new THREE.Color(0xf0f0f0);
  stars = isDarkMode ? getStarfield() : new THREE.Group();
  scene.add(stars);
  ambientLight.intensity = isDarkMode ? 0.3 : 0.6;
  panel.style.background = isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)";
  panel.style.color = isDarkMode ? "#fff" : "#000";
  tooltip.style.background = isDarkMode ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.9)";
  tooltip.style.color = isDarkMode ? "#fff" : "#000";
};
panel.appendChild(modeBtn);

// 🏷️ Tooltip
const tooltip = document.createElement("div");
Object.assign(tooltip.style, {
  position: "absolute",
  padding: "4px 8px",
  background: "rgba(0,0,0,0.75)",
  color: "#fff",
  fontSize: "12px",
  borderRadius: "4px",
  pointerEvents: "none",
  display: "none",
});
document.body.appendChild(tooltip);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ⏱️ Animate
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  if (!isPaused) {
    const delta = clock.getDelta();
    planets.forEach((planet) => {
      planet.userData.angle += planet.userData.speed * delta * 60;
      const r = planet.userData.orbitRadius;
      const a = planet.userData.angle;
      planet.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      planet.rotation.y += 0.01;
    });
  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([...planets.map(p => p.userData.mesh), sun], false);
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const name = obj.name || obj.userData?.planetGroup?.userData?.name || "Unknown";
    tooltip.style.display = "block";
    tooltip.innerText = name;
    const pos = obj.getWorldPosition(new THREE.Vector3()).project(camera);
    tooltip.style.left = `${(pos.x * 0.5 + 0.5) * window.innerWidth + 10}px`;
    tooltip.style.top = `${(-pos.y * 0.5 + 0.5) * window.innerHeight + 10}px`;
  } else {
    tooltip.style.display = "none";
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// 📐 Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



