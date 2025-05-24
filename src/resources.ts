import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';


export class ModelLoader {
  private _loader: GLTFLoader;

  constructor() {
    this._loader = new GLTFLoader();
  }

  async load() {
    const gltf = await this._loader.loadAsync(`/crystal.glb`);
    const star = gltf.scene.getObjectByName("Star") as THREE.Mesh;
    const heart = gltf.scene.getObjectByName("Heart") as THREE.Mesh;
    const diamond = gltf.scene.getObjectByName("Diamond") as THREE.Mesh;
    const emerald = gltf.scene.getObjectByName("Emerald") as THREE.Mesh;
    console.log("models are loaded");
    return [star, heart, diamond, emerald];
  }
}