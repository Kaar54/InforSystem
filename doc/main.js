import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// 光源
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 0);
scene.add(light);

// 太陽・地球モデル
let earth, sun;

const loader = new GLTFLoader();
loader.load('blend/sun.glb', glb => {
  sun = glb.scene;
  sun.scale.set(2, 2, 2);
  scene.add(sun);
});

loader.load('blend/earth.glb', glb => {
  earth = glb.scene;
  earth.scale.set(0.5, 0.5, 0.5);
  scene.add(earth);
});

// 初期状態
let pos = new THREE.Vector3(10, 0, 0);
let vel = new THREE.Vector3(0, 1.8, 0);  // 初速度（調整可）
const G = 100;
const M = 1000;
const dt = 0.01;

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  if (earth && sun) {
    // 重力計算
    const r = new THREE.Vector3().subVectors(sun.position, pos);
    const dist = r.length();
    const forceDir = r.normalize();
    const forceMag = (G * M) / (dist * dist);
    const acc = forceDir.multiplyScalar(forceMag);

    // 運動の更新
    vel.addScaledVector(acc, dt);
    pos.addScaledVector(vel, dt);

    earth.position.copy(pos);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
