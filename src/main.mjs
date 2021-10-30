import colors from "colors/safe.js";
import { stdin as input, stdout as output } from "process";
import EventEmitter from "events";

import { waitForResize, isNumeric, isBound } from "./utils/utils.js";
import { generateGridOutput, generateRandomGrid } from "./grid.js";

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

const changeEmmiter = new EventEmitter();

const nullifyInput = () => {
  userInput.col = null;
  userInput.row = null;
  // Only emit 'inputChange' once
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

const main = async () => {
  let sudokuGrid = generateRandomGrid();

  const HEIGHT_THRESHOLD = 28; // Terminal Rows Height

  changeEmmiter.addListener("inputFinished", () => {
    const { row, col, value } = userInput;
    sudokuGrid[row][col] = value;
    nullifyInput();
  });

  const awaitChange = () => {
    return new Promise((resolve) => {
      changeEmmiter.once("inputChange", () => {
        resolve();
      });
    });
  };

  console.clear();

  while (true) {
    if (process.stdout.rows < 28) {
      console.log(`Adjust terminal size for the game to fit
      Current Height is ${process.stdout.rows}
      Required is Height ${HEIGHT_THRESHOLD}`);
      await waitForResize(HEIGHT_THRESHOLD, Infinity);
    }

    console.clear();
    console.log(generateGridOutput(sudokuGrid, userInput));

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
