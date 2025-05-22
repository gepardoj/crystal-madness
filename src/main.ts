import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import './style.css'
import * as THREE from 'three';

(() => {
  const crystals: THREE.Mesh[] = [];

  const OFFSET = .4 as const;
  const GRID_SIZE = [5, 5] as const;

  const loader = new GLTFLoader();
  loader.load(
    `/crystal.glb`,
    (gltf) => {
      const child = gltf.scene.children[0];
      if (!(child instanceof THREE.Mesh)) return
      for (let i = 0; i < GRID_SIZE[0] * GRID_SIZE[1]; i++) {
        const crystal = new THREE.Mesh(child.geometry, child.material);
        scene.add(crystal);
        crystal.position.set(
          i % GRID_SIZE[0] * OFFSET,
          Math.floor(i / GRID_SIZE[0]) * -OFFSET,
          0);
        crystal.rotation.set(90, 0, 0);
        crystal.scale.set(.05, .05, .05);
        crystals.push(crystal);
      }
      console.log("resources loaded");
    },
    undefined,
    () => {
      console.log("error at loading resources")
    }
  )

  console.log("init canvas");
  const canvas = document.querySelector("#game");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff_ff_ff);
  const camera = new THREE.OrthographicCamera();
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const light = new THREE.DirectionalLight();
  light.position.set(1, 1, 1);
  scene.add(light);

  camera.position.set(.8, -.8, 100)

  function animate() {
    crystals.forEach((crystal, i) => {
      crystal.rotation.z += 0.01 * (i + 1);
    })

    // console.log(renderer.info);
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
})();
