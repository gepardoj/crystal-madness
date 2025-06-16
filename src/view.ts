import * as THREE from 'three';
import { gsap } from "gsap";
import { FIELD_SIZE, type Crystal } from '@/model/model';
import { swapD2 } from '@/utils';
import { Observer } from '@/observer';

const OFFSET = .4 as const;


export class View {
  private _scene: THREE.Scene;
  private _renderer: THREE.WebGLRenderer;
  private _camera: THREE.Camera;

  private _crystal_models: THREE.Mesh[] = [];
  private _crystals: (THREE.Mesh | null)[][] = [];

  get canvas() { return this._renderer.domElement; }

  constructor() {
    const canvas = document.querySelector("#game");

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xff_ff_ff);
    this._camera = new THREE.OrthographicCamera();

    this._renderer = new THREE.WebGLRenderer({
      canvas: canvas as HTMLCanvasElement,
      antialias: true,
    });
    if (!(canvas instanceof HTMLCanvasElement)) return;
    this._renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const light = new THREE.DirectionalLight("white", 5);
    light.position.set(5, 10, 7).normalize();
    this._scene.add(light);

    const ambient = new THREE.AmbientLight("white", .5);
    ambient.position.set(1, 1, 1);
    this._scene.add(ambient);

    this._camera.position.set(.8, -.8, 100);

    this.onCrystalsSwap = this.onCrystalsSwap.bind(this);
    this.onCrystalsMatched = this.onCrystalsMatched.bind(this);
    this.onCrystalFalling = this.onCrystalFalling.bind(this);
    Observer.subscribe("crystals_swap", this.onCrystalsSwap);
    Observer.subscribe("crystals_matched", this.onCrystalsMatched);
    Observer.subscribe("crystal_falling", this.onCrystalFalling);

    console.log("the view is initialized");
  }

  start() {
    console.log("the render is started");
    this._renderer.setAnimationLoop(() => this.animate());
  }

  initCrystals(models: THREE.Mesh[], field: readonly Crystal[][]) {
    this._crystal_models = models;
    for (let row = 0; row < FIELD_SIZE[0]; row++) {
      this._crystals[row] = [];
      for (let col = 0; col < FIELD_SIZE[1]; col++) {
        const v = field[row][col];
        if (v === null) continue;
        const random = models[v];
        const crystal = new THREE.Mesh(random.geometry, random.material);
        this._scene.add(crystal);
        crystal.position.set(col * OFFSET, row * -OFFSET, 0);
        crystal.rotation.set(0, 0, 0);
        crystal.scale.set(.05, .05, .05);
        this._crystals[row][col] = crystal;
      }
    }
    console.log("models are initialized");
  }

  private onCrystalsSwap(col: number, row: number, col2: number, row2: number, dir: THREE.Vector2) {
    this.swap(col, row, col2, row2, dir);
  }

  private onCrystalsMatched(field: readonly Crystal[][]) {
    console.log("Model changed");
    this.removeCrystals(field);
  }

  private onCrystalFalling(type: "old" | Crystal, fromRow: number, fromCol: number, toRow: number, toCol: number) {
    console.log("from", fromRow, fromCol, "to", toRow, toCol);
    let crystal = null;
    if (type === "old") {
      crystal = this._crystals[fromRow][fromCol];
      if (crystal === null) return;
      this._crystals[fromRow][fromCol] = null;
      this._crystals[toRow][toCol] = crystal;
    } else if (type !== null) {
      const mesh = this._crystal_models[type];
      crystal = new THREE.Mesh(mesh.geometry, mesh.material);
      this._scene.add(crystal);
      crystal.position.set(fromCol * OFFSET, fromRow * -OFFSET, 0);
      crystal.rotation.set(0, 0, 0);
      crystal.scale.set(.05, .05, .05);
      this._crystals[toRow][toCol] = crystal;
    }
    if (crystal === null) return;
    const DISTANCE = .4 as const;
    gsap.to(crystal.position, {
      y: "-=" + (toRow - fromRow) * DISTANCE,
      duration: .5,
    });
    console.table(this._crystals);
  }

  removeCrystals(field: readonly Crystal[][]) {
    for (let row = 0; row < FIELD_SIZE[0]; row++) {
      for (let col = 0; col < FIELD_SIZE[1]; col++) {
        const v = field[row][col];
        if (v === null) {
          const crystal = this._crystals[row][col];
          this._crystals[row][col] = null;
          if (crystal !== null) this._scene.remove(crystal);
        }
      }
    }
  }

  remove(x: number, y: number) {
    const crystal = this._crystals[x][y];
    if (crystal) this._scene.remove(crystal);
  }

  swap(col: number, row: number, col2: number, row2: number, dir: THREE.Vector2) {
    const fromCrystal = this._crystals[col][row];
    const toCrystal = this._crystals[col2][row2];
    if (fromCrystal === null || toCrystal === null) return;
    const DISTANCE = .4 as const;
    gsap.to(fromCrystal.position, {
      x: "-=" + dir.x * DISTANCE,
      y: "+=" + dir.y * DISTANCE,
      duration: .5,
    });
    gsap.to(toCrystal.position, {
      x: "+=" + dir.x * DISTANCE,
      y: "-=" + dir.y * DISTANCE,
      duration: .5,
    });
    swapD2(this._crystals, col, row, col2, row2);
  }

  private animate() {
    for (let row = 0; row < FIELD_SIZE[0]; row++) {
      for (let col = 0; col < FIELD_SIZE[1]; col++) {
        const crystal = this._crystals[row][col];
        if (crystal) crystal.rotation.y += 0.02;
      }
    }

    // console.log(renderer.info);
    this._renderer.render(this._scene, this._camera);
  }
}