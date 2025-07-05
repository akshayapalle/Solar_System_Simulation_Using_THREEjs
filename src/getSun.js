import * as THREE from 'three';
import { getFresnelMat } from "./getFresnelMat.js";

function getSun(texture) {
    const geo = new THREE.SphereGeometry(1, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
        map: texture,
        emissive: 0xff9900,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.8,
    });
    const sun = new THREE.Mesh(geo, mat);

    const rimMat = getFresnelMat({ rimHex: 0xffcc00, facingHex: 0x000000 });
    const rimMesh = new THREE.Mesh(geo, rimMat);
    rimMesh.scale.setScalar(1.01);
    sun.add(rimMesh);

    const light = new THREE.PointLight(0xffcc00, 5, 100);
    sun.add(light);

    return sun;
}

export default getSun;

