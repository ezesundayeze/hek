/*
This function can be used to generate random code for vrification or whatever.
*/
const RandomCode = (base = 36, length = 6) => {
  return Math.random().toString(base).substr(2, length);
};

module.exports = RandomCode;
