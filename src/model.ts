import { getRandom } from "./utils";

type Crystal = 0 | 1;
const CRYSTAL_NUMBER = 2 as const;
export const FIELD_SIZE = [5, 5] as const;

export class Model {
  private _field: Crystal[][] = [];

  get field(): ReadonlyArray<Crystal[]> { return this._field }

  constructor() {
  }

  init() {
    this.generateField();
  }

  private generateField() {
    for (let x = 0; x < FIELD_SIZE[0]; x++) {
      const col: Crystal[] = [];
      for (let y = 0; y < FIELD_SIZE[1]; y++) {
        col.push(Math.round(getRandom() * (CRYSTAL_NUMBER - 1)) as Crystal);
      }
      this._field.push(col);
    }
  }
}