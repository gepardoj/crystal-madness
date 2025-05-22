export function getRandom(): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / 4294967295; // map to [0, 1]
}