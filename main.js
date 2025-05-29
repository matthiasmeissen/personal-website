import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const canvas = document.getElementById("three-canvas")

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 4);

// Renderer using the existing canvas
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// Function to resize based on canvas size
    function resizeRendererToDisplaySize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    }

    // Initial resize
    resizeRendererToDisplaySize();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8)
pointLight.position.set(5, 5, 4)
scene.add(pointLight)

const pointLight1 = new THREE.PointLight(0xffffff, 0.8)
pointLight1.position.set(5, -5, 20)
scene.add(pointLight1)

let model

// Load OBJ model
const loader = new OBJLoader();
loader.load(
    'assets/logo-model.obj',
    (object) => {
        // Center the model pivot
        const box = new THREE.Box3().setFromObject(object);
        const center = new THREE.Vector3();
        box.getCenter(center);
        object.position.sub(center);

        // Initial scale
        object.scale.set(1, 1, 1);

        // Apply a metallic material to meshes
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xaaaaaa,
              metalness: 1.0,
              roughness: 0.2
            });
          }
        });

        model = object;
        scene.add(model);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('An error happened while loading the OBJ:', error);
    }
);

// Handle window resize
window.addEventListener('resize', resizeRendererToDisplaySize);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.005; // rotate the model
    renderer.render(scene, camera);
}
animate();
