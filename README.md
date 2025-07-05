🌌 Solar-System-Simulation using Three.js

## 🌐 Live Demo

🔗 [Solar System Simulation Live Site](https://akshayapalle.github.io/Solar_System_Simulation_Using_THREEjs/)

This is an interactive 3D simulation of our solar system built using Three.js and JavaScript. It features the Sun at the center with all 8 planets orbiting around it in real-time. Each planet has realistic textures, orbital motion, and its own rotation. Users can control the speed of each planet's orbit using sliders, pause or resume the animation, and switch between dark and light modes. Hovering over a planet reveals its name through a smooth tooltip. The project runs smoothly in any modern browser and offers a visually engaging way to explore the solar system.

🛠️ Built With: 

. Three.js – for 3D rendering, camera, lights, and animations

. JavaScript (ES6) – for scripting logic and interactivity

. HTML5 – to structure the page and render the canvas

. OrbitControls – to allow smooth camera rotation and zoom

. ShaderMaterial (Fresnel Effect) – to create realistic rim lighting on planets

. THREE.Raycaster – to enable tooltip interactivity on planet hover

. THREE.Clock + requestAnimationFrame – to drive real-time orbital motion

. Planet Textures – sourced from Planetary Pixel Emporium for a realistic look

📁 Folders & Files created: 

index.html – Main HTML file, sets up the canvas and loads scripts (no CSS used).
index.js – Core logic for rendering planets, sun, lighting, animations, and UI controls.
textures/ – Contains subfolders and image files for planet and sun textures.
earth/, mercury/, venus/, saturn/, uranus/ – Contain high-res textures.
jupiter.png, mars.png, neptune.png, sunmap.jpg – Used directly.
src/ – Modular helper JavaScript files:
getPlanet.js – Creates each planet with textures, bump/specular maps, clouds, rings.
getSun.js – Builds the glowing Sun using Fresnel material.
getStarfield.js – Adds starfield background.
getElipticLines.js – Draws orbit rings for planets.
getAsteroidBelt.js – Generates asteroid belt (if used).

▶️ Run with Live Server:

Open Folder in VS Code
Open your solar-system-simulation folder.
Right-click index.html → "Open with Live Server"
This launches the simulation in your browser.


💡 How to Use the Output:

Speed Sliders: Control orbit speed of each planet in real-time.
Pause/Resume Button: Toggle planetary motion.
Dark/Light Mode Toggle: Switch between space and bright view.
Hover Tooltips: Move your mouse over any planet (or the Sun) to see its name.
Mouse Controls: Rotate, zoom, and pan the camera freely (via OrbitControls).

* Explore the solar system interactively — adjust speeds, switch themes, and hover to identify each planet. 🚀🪐
