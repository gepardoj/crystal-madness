import { Match3 } from "@/model/match3";
import { Observer } from "@/observer";
import { getRandom, swapD2 } from "@/utils";
import type { Vector2 } from "three";

export type Crystal = null | 0 | 1 | 2 | 3;
const CRYSTAL_NUMBER = 4 as const;
export const FIELD_SIZE = [5, 5] as const;

export class Model {
  private _field: Crystal[][] = [];

  get field(): readonly Crystal[][] { return this._field; }

  constructor() {
  }

  init() {
    this.generateField();
  }

  remove(row: number, col: number) {
    this._field[row][col] = null;
  }

  swap(col: number, row: number, col2: number, row2: number, dir: Vector2) {
    swapD2(this._field, col, row, col2, row2);
    Observer.notify("crystals_swap", col, row, col2, row2, dir);
    // this.cascadeMatch();
    console.table(this._field);
  }

  cascadeMatch() {
    const matches = Match3.findMatches(this._field, FIELD_SIZE[0], FIELD_SIZE[1]);
    if (matches.length === 0) return;
    console.log("before match");
    console.table(this._field);
    matches.forEach(([row, col]) => this._field[row][col] = null);
    console.log("after match");
    console.table(this._field);
    Observer.notify("crystals_matched", this.field);
    setTimeout(() => {
      let i = 0;
      for (const val of Match3.invokeFalling(this._field, FIELD_SIZE[0], FIELD_SIZE[1])) {
        if (val.type === "step") {
          setTimeout(() => Observer.notify("crystal_falling", val.from[0], val.from[1], val.to[0], val.to[1]), i * 200);
        } else if (val.type === "result") {
          this._field = val.grid;
          console.log("after fall");
          console.table(this.field);
          // Observer.notify("crystal_matched");
        }
        i++;
      }
    }, 1000);
  }

  private generateField() {
    for (let row = 0; row < FIELD_SIZE[0]; row++) {
      this._field[row] = [];
      for (let col = 0; col < FIELD_SIZE[1]; col++) {
        const crystal = Math.round(getRandom() * (CRYSTAL_NUMBER - 1)) as Crystal;
        this._field[row][col] = crystal;
      }
    }
  }
}