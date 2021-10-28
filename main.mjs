import logUpdate from "log-update";
import colors from "colors/safe.js";

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
      for (let j = 0; j < list[i].length; j++) output += colors.green("+---");
      output += colors.green("+\n");
    }
    for (let [j, item] of list[i].entries()) {
      output +=
        (j % 3 == 0 ? colors.green("| ") : colors.gray("| ")) + item + " ";
    }
    output += colors.green("|\n");

    for (let j = 0; j < list[i].length; j++) {
      output +=
        (j % 3 == 0 || (i + 1) % 3 == 0
          ? colors.green("+")
          : colors.gray("+")) +
        ((i + 1) % 3 == 0 ? colors.green("---") : colors.gray("---"));
    }
    output += colors.green("+\n");
  }

  logUpdate(output);
};

printGrid(generateRandomGrid());
