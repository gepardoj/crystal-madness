import './style.css'
import * as THREE from 'three';

(() => {
  const canvas = document.querySelector("#game");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff_ff_ff);
  const camera = new THREE.OrthographicCamera();
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true,
  });

  const light = new THREE.DirectionalLight();
  light.position.set(1, 1, 1);
  scene.add(light);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0xff_33_33 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;

  function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
})();
