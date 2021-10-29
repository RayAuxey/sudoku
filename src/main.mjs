import colors from "colors/safe.js";
import readline from "readline";
import { stdin as input, stdout as output } from "process";
import logUpdate, { createLogUpdate } from "log-update";

const rl = readline.createInterface({
  input,
  output,
});

const log = createLogUpdate(output, {
  showCursor: true,
});

const generateRandomGrid = () => {
  const output = [];
  for (let i = 0; i < 9; i++) {
    output[i] = [];
    for (let j = 0; j < 9; j++) {
      output[i][j] = Math.floor(1 + Math.random() * 9);
    }
  }
  return output;
};

const printGrid = (list) => {
  let output = "";

  for (let i = 0; i < list.length; i++) {
    if (i == 0) {
      // Column Numbers
      output += "  ";
      for (let j = 0; j < list[i].length; j++)
        output += colors.italic(colors.gray(`  ${j} `));
      output += "\n";

      output += "  ";
      for (let j = 0; j < list[i].length; j++) output += colors.green("+---");
      output += colors.green("+\n");
    }
    // Row Numbers
    output += colors.italic(colors.gray(`${i} `));

    for (let [j, item] of list[i].entries()) {
      output +=
        (j % 3 == 0 ? colors.green("| ") : colors.gray("| ")) + item + " ";
    }
    output += colors.green("|\n");

    // Padding for row Number
    output += "  ";

    for (let j = 0; j < list[i].length; j++) {
      output +=
        (j % 3 == 0 || (i + 1) % 3 == 0
          ? colors.green("+")
          : colors.gray("+")) +
        ((i + 1) % 3 == 0 ? colors.green("---") : colors.gray("---"));
    }
    output += colors.green("+\n");
  }

  log(output);
};

let sudokuGrid = generateRandomGrid();
const HEIGHT_THRESHOLD = 28;

console.clear();

const main = async () => {
  while (true) {
    if (process.stdout.rows < 28) {
      log(`Adjust terminal size for the game to fit
      Current Height is ${process.stdout.rows}
      Required is Height ${HEIGHT_THRESHOLD}`);
      await waitForResize(HEIGHT_THRESHOLD, Infinity);
    }
    console.clear();
    log.clear();
    printGrid(sudokuGrid);

    const row = await getInput("Specify row:   ");
    if (isNumeric(row) && isBound(row, 0, 8)) {
      const col = await getInput("Specify col:   ");
      if (isNumeric(col) && isBound(col, 0, 8)) {
        const value = await getInput("Specify value: ");
        if (isNumeric(value) && isBound(value, 1, 9)) {
          sudokuGrid[row][col] = value;
        }
      }
    }
  }
};

main();

function waitForResize(min, max) {
  return new Promise((resolve, _) => {
    process.stdout.on("resize", () => {
      const rows = process.stdout.rows;
      // console.log("Current height is", rows);
      if (rows >= min && rows <= max) {
        resolve();
        // process.stdout.off("resize", () => {});
      }
    });
  });
}

function getInput(question) {
  return new Promise((resolve, _) => {
    rl.question(question, (answer) => resolve(answer));
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
