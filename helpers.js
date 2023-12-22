export const getRandomProp = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

export const randomIntfunction = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
