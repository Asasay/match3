export const getRandomProp = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

export const randomIntfunction = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const swapElements2D = (matrix, i1, j1, i2, j2) => {
  const tempObject = matrix[i1][j1];
  matrix[i1][j1] = matrix[i2][j2];
  matrix[i2][j2] = tempObject;
};

export const transpose = (matrix) => {
  return matrix.reduce((prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])), []);
};

export const principalDiagonal = (matrix) => [matrix.map((a, i) => a[i])];
export const secondaryDiagonal = (matrix) => [
  [...matrix].map((a, i) => a.reverse()).map((a, i) => a[i]),
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
