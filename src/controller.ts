import { Vector2 } from "three";
import { FIELD_SIZE } from "@/model/model";

type SwapFunc = (col: number, row: number, col2: number, row2: number, direction: Vector2) => void;

export class Controller {
  private _canvas: HTMLCanvasElement;
  private _draggedPos: Vector2 | null = null;
  private _onSwap: SwapFunc;


  constructor(canvas: HTMLCanvasElement, { onSwap }: { onSwap: SwapFunc; }) {
    this._canvas = canvas;
    this._onSwap = onSwap;
    this.down = this.down.bind(this);
    this.move = this.move.bind(this);
    this.up = this.up.bind(this);
  }

  activate(activate: boolean) {
    if (activate) {
      document.addEventListener("pointerdown", this.down);
      document.addEventListener("pointermove", this.move);
      document.addEventListener("pointerup", this.up);
    }
    else {
      document.removeEventListener("pointerdown", this.down);
      document.removeEventListener("pointermove", this.move);
      document.removeEventListener("pointerup", this.up);
    }
  }

  private down(e: PointerEvent) {
    console.log(this);
    if (e.target !== this._canvas) return;
    this._draggedPos = new Vector2(e.offsetX, e.offsetY);
  }

  private move(e: PointerEvent) {
    if (this._draggedPos !== null) console.log("drag");
  }

  private up(e: PointerEvent) {
    if (e.target !== this._canvas || this._draggedPos === null) {
      this._draggedPos = null;
      return;
    }
    console.log("release");
    console.log(e.offsetX, e.offsetY);
    const direction = this._draggedPos.clone().sub(new Vector2(e.offsetX, e.offsetY)).normalize();
    // makes move strictly horizontally or vertically
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
      direction.y = 0;
    } else {
      direction.x = 0;
    }
    //
    const col = Math.floor(this._draggedPos.x / this._canvas.width * FIELD_SIZE[0]);
    const row = Math.floor(this._draggedPos.y / this._canvas.height * FIELD_SIZE[1]);
    const col2 = col - Math.round(direction.x);
    const row2 = row - Math.round(direction.y);
    this._draggedPos = null;
    console.log(col, row, col2, row2, direction);
    if (row2 < 0 || row2 >= FIELD_SIZE[1] || col2 < 0 || col2 >= FIELD_SIZE[1]) {
      console.log("boundaries");
      return;
    }
    this._onSwap(row, col, row2, col2, direction);
  };
}