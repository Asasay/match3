export const getRandomProp = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

export const randomIntfunction = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const swapElements2D = (array, i1, j1, i2, j2) => {
  const tempObject = array[i1][j1];
  array[i1][j1] = array[i2][j2];
  array[i2][j2] = tempObject;
};
