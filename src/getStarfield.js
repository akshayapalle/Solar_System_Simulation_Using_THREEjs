import * as THREE from "three";

export default function getStarfield({ numStars = 500, size = 0.2 } = {}) {
  const vertices = [];
  const colors = [];

  for (let i = 0; i < numStars; i++) {
    const r = Math.random() * 50 + 30;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    vertices.push(x, y, z);
    const color = new THREE.Color().setHSL(0.6, 0.7, Math.random());
    colors.push(color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
  });

  return new THREE.Points(geometry, material);
}
