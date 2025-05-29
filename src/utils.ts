export function getRandom(): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / 4294967295; // map to [0, 1]
}

export function swapD2(arr: unknown[][], x: number, y: number, x2: number, y2: number) {
  [arr[x][y], arr[x2][y2]] = [arr[x2][y2], arr[x][y]];
}

export const uniquePairs = (pairs: [number, number][]) => Array.from(new Set(pairs.map(([x, y]) => `${x}:${y}`)).values()).map(str => str.split(":").map(_ => parseInt(_, 10)) as [number, number]);