const colors = require("colors/safe");

const generateGridOutput = (grid, userInput) => {
  let output = "";

  for (let i = 0; i < grid.length; i++) {
    if (i == 0) {
      // Column Numbers
      output += "  ";
      for (let j = 0; j < grid[i].length; j++)
        output += colors.italic(
          j === userInput.col
            ? colors.bold(colors.green(`  ${j} `))
            : colors.gray(`  ${j} `)
        );
      output += "\n";

      output += "  ";
      for (let j = 0; j < grid[i].length; j++) output += colors.green("+---");
      output += colors.green("+\n");
    }
    // Row Numbers
    output += colors.italic(
      i === userInput.row
        ? colors.bold(colors.green(`${i} `))
        : colors.gray(`${i} `)
    );

    for (let [j, item] of grid[i].entries()) {
      output +=
        (j % 3 == 0 ? colors.green("| ") : colors.gray("| ")) + item + " ";
    }
    output += colors.green("|\n");

    // Padding for row Number
    output += "  ";

    for (let j = 0; j < grid[i].length; j++) {
      output +=
        (j % 3 == 0 || (i + 1) % 3 == 0
          ? colors.green("+")
          : colors.gray("+")) +
        ((i + 1) % 3 == 0 ? colors.green("---") : colors.gray("---"));
    }
    output += colors.green("+\n");
  }

  return output;
};

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

module.exports = {
  generateGridOutput,
  generateRandomGrid,
};
