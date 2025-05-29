import { describe, expect, it } from "vitest";
import { Match3 } from "@/model/match3";

describe("Match-3", () => {
  it("finds matches correctly", () => {
    const actual = Match3.findMatches([
      [0, 1, 1, 1],
      [0, 2, 1, 1],
      [0, 2, 1, 3],
      [0, 0, 0, 0],
    ], 4, 4);
    const expected = [
      [0, 0], [0, 1], [0, 2], [0, 3],
      [1, 0], [1, 2],
      [2, 0], [2, 2],
      [3, 0], [3, 1], [3, 2], [3, 3]
    ];
    // console.table(actual);
    expect(actual).toEqual(expect.arrayContaining(expected));
    expect(actual).toHaveLength(expected.length);
  });

  it("finds matches correctly v2", () => {
    const actual = Match3.findMatches([
      [0, 1, 0, 0],
      [1, 1, 1, 1],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ], 4, 4);
    const expected = [
      [0, 1],
      [1, 0], [1, 1], [1, 2], [1, 3],
      [2, 1],
      [3, 1],
    ];
    // console.table(actual);
    expect(actual).toEqual(expect.arrayContaining(expected));
    expect(actual).toHaveLength(expected.length);
  });

  it("finds matches correctly v3", () => {
    const actual = Match3.findMatches([
      [0, 1, 0, 0],
      [1, 1, 0, 1],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ], 4, 4);
    const expected = [
      [0, 1], [0, 2],
      [1, 1], [1, 2],
      [2, 1], [2, 2],
      [3, 1], [3, 2],
    ];
    // console.table(actual);
    expect(actual).toEqual(expect.arrayContaining(expected));
    expect(actual).toHaveLength(expected.length);
  });

  it("falls correctly v1", () => {
    const given =
      [[1, 1, null, null],
      [2, null, 2, 2],
      [null, 3, null, 3],
      [4, null, null, 4]
      ];
    const res = [...Match3.invokeFalling(given, 4, 4)].at(-1);
    if (res?.type !== "result") return;
    const actual = res.grid;
    const expected = [
      [null, null, null, null],
      [1, null, null, 2],
      [2, 1, null, 3],
      [4, 3, 2, 4]
    ];
    // console.table(given);
    // console.log("actual");
    // console.table(actual);
    // console.log("expected");
    // console.table(expected);
    expect(actual).toEqual(expected);
  });

  it("falls correctly v2", () => {
    const given = [
      [null, null, null, null, 2],
      [3, 1, 0, null, 3],
      [1, 2, 0, null, 1],
      [0, 1, 1, 3, 1],
      [2, 1, null, null, null]
    ];
    const res = [...Match3.invokeFalling(given, 5, 5)].at(-1);
    if (res?.type !== "result") return;
    const actual = res.grid;
    const expected = [
      [null, null, null, null, null],
      [3, 1, null, null, 2],
      [1, 2, 0, null, 3],
      [0, 1, 0, null, 1],
      [2, 1, 1, 3, 1]
    ];
    // console.table(given);
    // console.log("actual");
    // console.table(actual);
    // console.log("expected");
    // console.table(expected);
    expect(actual).toEqual(expected);
  });
});