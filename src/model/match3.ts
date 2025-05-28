import { uniquePairs } from "@/utils";

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
  static invokeFalling(grid: readonly unknown[][], maxRow: number, maxCol: number) {
    const clone = grid.map(row => row.map(v => v));

    for (let col = 0; col < maxCol; col++) {
      const values = Array(maxRow).fill(null);
      let i = 0;
      for (let row = maxRow - 1; row >= 0; row--) {
        const el = clone[row][col];
        if (el !== null) values[i++] = el;
      }
      i = 0;
      for (let row = maxRow - 1; row >= 0; row--) {
        clone[row][col] = values[i++];
      }
    }
    return clone;
  }
}