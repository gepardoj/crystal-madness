import { uniquePairs } from "@/utils";

type FallingStep<T> =
  { type: "old" | T, from: [number, number], to: [number, number]; } |
  { type: "result", grid: T[][]; };

export class Match3 {
  /**
   * 
   * @param grid Two-dimensional array
   * @returns Array of [row,col] pairs that matches in 3-or-more
   */
  static findMatches(grid: readonly unknown[][], maxRow: number, maxCol: number): [number, number][] {
    const matches: [number, number][] = [];
    for (let row = 0; row < maxRow; row++) {
      for (let col = 0; col < maxCol; col++) {
        const origin = grid[row][col];
        if (origin === null) continue;
        matches.push(...this.findRookWay(grid, row, col, maxRow, maxCol));
      }
    }
    return uniquePairs(matches);
  }

  /**
   * Find horizontally and vertically (like a rook in chess) that matches origin
   */
  private static findRookWay(grid: readonly unknown[][], rowIn: number, colIn: number, maxRow: number, maxCol: number) {
    const vertMatches: [number, number][] = [[rowIn, colIn]];
    const origin = grid[rowIn][colIn];
    // up vertical check
    for (let row = rowIn - 1; row >= 0; row--) {
      if (grid[row][colIn] !== origin) break;
      vertMatches.push([row, colIn]);
    }
    // down veritcal check
    for (let row = rowIn + 1; row < maxRow; row++) {
      if (grid[row][colIn] !== origin) break;
      vertMatches.push([row, colIn]);
    }
    if (vertMatches.length >= 3) return vertMatches; // vertical and horizontal counts separately
    const horizMatches: [number, number][] = [[rowIn, colIn]];
    // left horizontal check
    for (let col = colIn - 1; col >= 0; col--) {
      if (grid[rowIn][col] !== origin) break;
      horizMatches.push([rowIn, col]);
    }
    // right horizontal check
    for (let col = colIn + 1; col < maxCol; col++) {
      if (grid[rowIn][col] !== origin) break;
      horizMatches.push([rowIn, col]);
    }
    if (horizMatches.length >= 3) return horizMatches;
    return [];
  }

  /**
   * Elements should fall when there're emptiness (null) below them 
   */
  static * invokeFalling<T>(grid: readonly T[][], maxRow: number, maxCol: number, newElements?: (i: number) => T): Generator<FallingStep<T>> {
    const clone = grid.map(row => row.map(v => v));
    for (let col = 0; col < maxCol; col++) {
      const values = Array(maxRow).fill(null); // placeholder for falled elements
      const elementsCoords: [number, number][] = [];
      for (let i = 0, row = maxRow - 1; row >= 0; row--) { // find all elements and write to beginning of array
        const el = clone[row][col];
        if (el === null) continue;
        values[i++] = el;
        elementsCoords.push([row, col]);
      }
      for (let i = 0, row = maxRow - 1; row >= 0; row--, i++) { // and copy them from bottom to right 
        if (elementsCoords[i]?.[0] === row && elementsCoords[i]?.[1] === col) continue;
        clone[row][col] = values[i];
        if (values[i] === null) continue;
        // console.log(elementsCoords[i], [row, col]);
        yield { type: "old", from: elementsCoords[i], to: [row, col] };
      }
      if (newElements) {
        for (let i = 0, row = maxRow - 1; row >= 0; row--, i++) {
          if (clone[row][col] !== null) continue;
          const el = newElements(i);
          clone[row][col] = el;
          yield { type: el, from: [-1, col], to: [row, col] };
        }
      }
    }
    yield { type: "result", grid: clone };
  }
}