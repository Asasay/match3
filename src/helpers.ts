export const getRandomProp = (object: Record<string, any>) => {
  const keys = Object.keys(object);
  return object[keys[(keys.length * Math.random()) << 0]];
};

export const randomIntfunction = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const swapElements2D = <T>(
  matrix: T[][],
  y1: number,
  x1: number,
  y2: number,
  x2: number
) => {
  const tempObject = matrix[y1][x1];
  matrix[y1][x1] = matrix[y2][x2];
  matrix[y2][x2] = tempObject;
  return matrix;
};

export const transpose = <T>(matrix: T[][]) => {
  const tmpAr: T[][] = [];
  for (let i = 0; i < matrix.length; i++) {
    tmpAr.push([]);
    for (let j = 0; j < matrix[i].length; j++) {
      tmpAr[i].push(matrix[j][i]);
    }
  }
  return tmpAr;
};

export const principalDiagonal = <T>(matrix: T[][]) => [matrix.map((row, i) => row[i])];
export const secondaryDiagonal = <T>(matrix: T[][]) => [
  matrix.map((row) => [...row].reverse()).map((row, i) => row[i]),
];

export const findIndex2D = <T>(array: T[][], value: T) => {
  let result = [-1, -1];
  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array[y].length; x++) {
      if (array[y][x] === value) {
        result[0] = y;
        result[1] = x;
        return result;
      }
    }
  }
  return result;
};

export const toWindows = <T>(inputArray: T[], size: number) => {
  let result = [];
  if (size >= inputArray.length) result.push(inputArray);
  else if (size == 0) result.push([]);
  else {
    for (let i = 0; i < inputArray.length - size + 1; i++) {
      result.push(inputArray.slice(i, i + size));
    }
  }
  return result;
};

export const moveNullsToLeft = <T>(array: T[]) =>
  array.filter((x) => x === null).concat(array.filter((x) => x !== null));

export const notEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};
