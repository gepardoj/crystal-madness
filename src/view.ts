import * as THREE from 'three';
import { FIELD_SIZE, type Model } from './model';

const OFFSET = .4 as const;


export class View {
  private _model: Model;
  private _scene: THREE.Scene;
  private _renderer: THREE.WebGLRenderer;
  private _camera: THREE.Camera;

  private _crystals: THREE.Mesh[] = []

  constructor(model: Model) {
    this._model = model;
    const canvas = document.querySelector("#game");

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xff_ff_ff);
    this._camera = new THREE.OrthographicCamera();

    this._renderer = new THREE.WebGLRenderer({
      canvas: canvas as HTMLCanvasElement, antialias: true,
    });
    if (!(canvas instanceof HTMLCanvasElement)) return;
    this._renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const light = new THREE.DirectionalLight();
    light.position.set(1, 1, 1);
    this._scene.add(light);

    this._camera.position.set(.8, -.8, 100);

    console.log("the view is initialized");
  }

  start() {
    console.log("the render is started")
    this._renderer.setAnimationLoop(() => this.animate());
  }

  initModels({ star, heart }: { star: THREE.Mesh, heart: THREE.Mesh }) {
    for (let x = 0; x < FIELD_SIZE[0]; x++) {
      for (let y = 0; y < FIELD_SIZE[1]; y++) {
        const v = this._model.field[x][y];
        const random = [star, heart][v];
        const crystal = new THREE.Mesh(random.geometry, random.material);
        this._scene.add(crystal);
        crystal.position.set(x * OFFSET, y * -OFFSET, 0);
        crystal.rotation.set(90, 0, 0);
        crystal.scale.set(.05, .05, .05);
        this._crystals.push(crystal);
      }
    }
    console.log("models are initialized")
  }

  animate() {
    this._crystals.forEach((crystal, i) => {
      crystal.rotation.z += 0.02;
    })

    // console.log(renderer.info);
    this._renderer.render(this._scene, this._camera);
  }
}