import colors from "colors/safe.js";
import { stdin as input, stdout as output } from "process";
import EventEmitter from "events";

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

const userInput = {
  row: null,
  col: null,
  value: null,
};

const inputProxy = new Proxy(userInput, {
  set: (target, key, value) => {
    target[key] = value;
    changeEmmiter.emit("inputChange");
    return true;
  },
});

const printGrid = (list) => {
  let output = "";

  for (let i = 0; i < list.length; i++) {
    if (i == 0) {
      // Column Numbers
      output += "  ";
      for (let j = 0; j < list[i].length; j++)
        output += colors.italic(
          j === userInput.col
            ? colors.bold(colors.green(`  ${j} `))
            : colors.gray(`  ${j} `)
        );
      output += "\n";

      output += "  ";
      for (let j = 0; j < list[i].length; j++) output += colors.green("+---");
      output += colors.green("+\n");
    }
    // Row Numbers
    output += colors.italic(
      i === userInput.row
        ? colors.bold(colors.green(`${i} `))
        : colors.gray(`${i} `)
    );

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

  console.log(output);
};

let sudokuGrid = generateRandomGrid();

const HEIGHT_THRESHOLD = 28; // Terminal Rows Height

const changeEmmiter = new EventEmitter();

const nullifyInput = () => {
  userInput.col = null;
  userInput.row = null;
  inputProxy.value = null;
};

input.setRawMode(true);
input.setEncoding("utf-8");
input.resume();

input.on("data", (char) => {
  if (char === "\u0003" || char === "q") {
    process.exit();
  }

  if (char === "u") {
    nullifyInput();
  }

  if (isNumeric(char) && isBound(char, 0, 9)) {
    if (userInput.row === null && isBound(char, 0, 8)) {
      inputProxy.row = +char;
    } else if (
      userInput.col === null &&
      isBound(char, 0, 8) &&
      userInput.row !== null
    ) {
      inputProxy.col = +char;
    } else if (
      userInput.value === null &&
      isBound(char, 1, 9) &&
      userInput.row !== null &&
      userInput.col !== null
    ) {
      inputProxy.value = +char;
      console.log(userInput);
      changeEmmiter.emit("inputFinished");
    }
  }

  // output.write(char);
});

changeEmmiter.addListener("inputFinished", () => {
  const { row, col, value } = userInput;
  sudokuGrid[row][col] = value;
  nullifyInput();
});

const awaitChange = () => {
  return new Promise((resolve) => {
    changeEmmiter
      .on("inputChange", () => {
        resolve();
      })
      .off("inputChange", () => {});
  });
};

const main = async () => {
  console.clear();
  while (true) {
    if (process.stdout.rows < 28) {
      console.log(`Adjust terminal size for the game to fit
      Current Height is ${process.stdout.rows}
      Required is Height ${HEIGHT_THRESHOLD}`);
      await waitForResize(HEIGHT_THRESHOLD, Infinity);
    }
    console.clear();
    printGrid(sudokuGrid);

    let message = "";
    if (userInput.row === null) {
      message += `Please select a ${colors.green(
        colors.bold("row")
      )} (0 - 8)\n`;
    } else {
      if (userInput.col === null) {
        message += `Please select a ${colors.green(
          colors.bold("column")
        )} (0 - 8)\n`;
      } else if (userInput.value === null) {
        message += `Please input a ${colors.green(
          colors.bold("value")
        )} (1 - 9)\n`;
      }
      message += `Press ${colors.bold("u")} to undo selection\n`;
    }
    message += `\nPress ${colors.bold("q")} to quit\n`;

    console.log(message);

    await awaitChange();
  }
};

main();

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
