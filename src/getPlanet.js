import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

const texLoader = new THREE.TextureLoader();
const geo = new THREE.SphereGeometry(1, 64, 64); // high-res planet mesh

function getPlanet({
  name = 'planet',
  img = '',
  folder = '',
  map,
  bump,
  specular,
  lights,
  clouds,
  size = 1,
  distance = 0,
  speed = 0.01,
  children = [], // ✅ new: rings, moons
}) {
  const group = new THREE.Group();
  const texturePath = folder ? `./textures/${folder}/` : `./textures/`;

  // 🌍 Load planet textures
  const mapTex = map ? texLoader.load(texturePath + map) : texLoader.load(texturePath + img);
  const bumpTex = bump ? texLoader.load(texturePath + bump) : null;
  const specTex = specular ? texLoader.load(texturePath + specular) : null;

  const material = new THREE.MeshPhongMaterial({
    map: mapTex,
    bumpMap: bumpTex || null,
    bumpScale: bumpTex ? 0.05 : 0,
    specularMap: specTex || null,
    specular: specTex ? new THREE.Color(0x222222) : null,
    shininess: specTex ? 10 : 0,
  });

  const planetMesh = new THREE.Mesh(geo, material);
  planetMesh.scale.setScalar(size);
  group.add(planetMesh);

  // ✨ Rim glow effect
  const rimMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0x000000 });
  const rim = new THREE.Mesh(geo, rimMat);
  rim.scale.setScalar(size * 1.01);
  planetMesh.add(rim);

  // ☁️ Optional cloud layer
  if (clouds) {
    const cloudTex = texLoader.load(texturePath + clouds);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(geo, cloudMat);
    cloudMesh.scale.setScalar(size * 1.02);
    group.add(cloudMesh);

    cloudMesh.userData.update = (t) => {
      cloudMesh.rotation.y = t * 0.2;
    };
  }

  // 🪐 Attach rings or moons
  children.forEach((child) => {
    group.add(child);
  });

  // 🌀 Orbit setup
  group.userData = {
    angle: Math.random() * Math.PI * 2,
    orbitRadius: distance,
    speed: speed,
    update: (t) => {
      planetMesh.rotation.y = t * 0.2;
      group.children.forEach((child) => {
        if (child.userData.update) child.userData.update(t);
      });
    },
  };

  return group;
}

export default getPlanet;
