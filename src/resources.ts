import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';


export class ModelLoader {
  private _loader: GLTFLoader;

  constructor() {
    this._loader = new GLTFLoader();
  }

  async load() {
    const gltf = await this._loader.loadAsync(`/crystal.glb`);
    const star = gltf.scene.children[0] as THREE.Mesh;
    const heart = gltf.scene.children[1] as THREE.Mesh;
    console.log("models are loaded");
    return { star, heart };
  }
}