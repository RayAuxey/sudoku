const colors = require("colors/safe");

const generateGridOutput = (grid, userInput) => {
  let output = "";

  for (let i = 0; i < grid.length; i++) {
    if (i == 0) {
      // Column Numbers Top
      //   if (userInput.row !== null /* show only when row is selected */) {
      output += "  ";
      for (let j = 0; j < grid[i].length; j++)
        output += colors.italic(
          j === userInput.col
            ? colors.bold(colors.green(`  ${j} `))
            : colors.gray(`  ${j} `)
        );
      output += "\n";
      //   }

      output += "  ";
      for (let j = 0; j < grid[i].length; j++) output += colors.green("+---");
      output += colors.green("+\n");
    }

    // Row Number Right
    output += colors.italic(
      i === userInput.row
        ? colors.bold(colors.green(`${i} `))
        : colors.gray(`${i} `)
    );

    // The Numbers in the grid
    for (let [j, item] of grid[i].entries()) {
      output +=
        (j % 3 == 0 ? colors.green("|") : colors.gray("|")) +
        highLightifSelected(` ${item} `, i, j, userInput);
    }
    output += colors.green("| ");

    // Row Number Left
    output += colors.italic(
      i === userInput.row
        ? colors.bold(colors.green(`${i}\n`))
        : colors.gray(`${i}\n`)
    );

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

  // Column Numbers Bottom
  //   if (userInput.row !== null) {
  output += "  ";
  for (let j = 0; j < grid[0].length; j++)
    output += colors.italic(
      j === userInput.col
        ? colors.bold(colors.green(`  ${j} `))
        : colors.gray(`  ${j} `)
    );
  output += "\n";
  //   }

  return output;
};

function highLightifSelected(str, i, j, { row, col }) {
  if (row === i && col === j) {
    return colors.bgBlack(colors.green(colors.bold(str)));
  }
  return str;
}

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
