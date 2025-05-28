import { Match3 } from "@/model/match3";
import { getRandom, swapD2 } from "@/utils";

type Crystal = null | 0 | 1 | 2 | 3;
const CRYSTAL_NUMBER = 4 as const;
export const FIELD_SIZE = [5, 5] as const;

export class Model {
  private _field: Crystal[][] = [];

  get field(): ReadonlyArray<Crystal[]> { return this._field; }

  constructor() {
  }

  init() {
    this.generateField();
  }

  remove(row: number, col: number) {
    this._field[row][col] = null;
  }

  swap(col: number, row: number, col2: number, row2: number) {
    swapD2(this._field, col, row, col2, row2);
    console.table(this._field);
  }

  cascadeMatch() {
    const matches = Match3.findMatches(this._field, FIELD_SIZE[0], FIELD_SIZE[1]);
    console.table(matches);
    matches.forEach(([row, col]) => this._field[row][col] = null);
  }

  private generateField() {
    for (let row = 0; row < FIELD_SIZE[0]; row++) {
      this._field[row] = [];
      for (let col = 0; col < FIELD_SIZE[1]; col++) {
        const crystal = Math.round(getRandom() * (CRYSTAL_NUMBER - 1)) as Crystal;
        this._field[row][col] = crystal;
      }
    }
    console.table(this._field);
  }
}