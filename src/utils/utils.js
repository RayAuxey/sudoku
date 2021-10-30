function waitForResize(min, max) {
  return new Promise((resolve, _) => {
    process.stdout.on("resize", () => {
      const rows = process.stdout.rows;
      if (rows >= min && rows <= max) {
        resolve();
      }
    });
  });
}

function isNumeric(str) {
  // str = str.trim();
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function isBound(val, min, max) {
  // val = val.trim();
  return val >= min && val <= max;
}

module.exports = {
  waitForResize,
  isNumeric,
  isBound,
};
