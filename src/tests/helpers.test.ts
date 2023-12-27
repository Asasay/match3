import {
  transpose,
  swapElements2D,
  principalDiagonal,
  secondaryDiagonal,
  findIndex2D,
  toWindows,
  moveNullsToLeft,
} from "../helpers";
import { expect, test } from "vitest";

let array = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

test("transpose", () => {
  expect(transpose(array)).toStrictEqual([
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ]);
});

test("principalDiagonal", () => {
  expect(principalDiagonal(array)).toStrictEqual([[1, 5, 9]]);
});

test("secondaryDiagonal", () => {
  expect(secondaryDiagonal(array)).toStrictEqual([[3, 5, 7]]);
});

test("swap", () => {
  const prev: number[][] = JSON.parse(JSON.stringify(array));
  expect(swapElements2D(array, 0, 2, 1, 0)).toStrictEqual([
    [1, 2, 4],
    [3, 5, 6],
    [7, 8, 9],
  ]);
  array = prev;
});

test("find index", () => {
  expect(findIndex2D(array, 4)).toStrictEqual([1, 0]);
});

test("window function", () => {
  expect(toWindows([1, 2, 3, 4, 5], 3)).toStrictEqual([
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
  ]);
  expect(toWindows([1, 2, 3], 3)).toStrictEqual([[1, 2, 3]]);
  expect(toWindows([1, 2, 3], 5)).toStrictEqual([[1, 2, 3]]);
  expect(toWindows([1, 2, 3, 4, 5], 1)).toStrictEqual([[1], [2], [3], [4], [5]]);
  expect(toWindows([], 1)).toStrictEqual([[]]);
});

test("move nulls to the left function", () => {
  expect(moveNullsToLeft([3, 2, null, 4, null, null])).toStrictEqual([null, null, null, 3, 2, 4]);
});
