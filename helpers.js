export const getRandomProp = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

export const randomIntfunction = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const swapElements2D = (matrix, y1, x1, y2, x2) => {
  const tempObject = matrix[y1][x1];
  matrix[y1][x1] = matrix[y2][x2];
  matrix[y2][x2] = tempObject;
  return matrix;
};

export const transpose = (matrix) => {
  return matrix.reduce((prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])), []);
};

export const principalDiagonal = (matrix) => [matrix.map((row, i) => row[i])];
export const secondaryDiagonal = (matrix) => [
  matrix.map((row) => [...row].reverse()).map((row, i) => row[i]),
];

export const findIndex2D = (array, value) => {
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

export const toWindows = (inputArray, size) => {
  return inputArray.reduce(
    (acc, _, index, arr) =>
      index + size > arr.length ? acc : acc.concat([arr.slice(index, index + size)]),
    []
  );
};

export const moveNullsToLeft = (array) => {
  return array.filter((x) => x === null).concat(array.filter((x) => x !== null));
};
