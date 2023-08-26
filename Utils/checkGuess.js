const s = "Secondary";
const g = "Success";
const b = "Primary";

module.exports = async (currentGuess, rightGuessString) => {
  let guessString = "";
  let rightGuess = Array.from(rightGuessString);

  for (const val of currentGuess) {
    guessString += val;
  }

  let feedback = "";

  for (let i = 0; i < 5; i++) {
    let letterColor = "";
    let letter = currentGuess[i];

    let letterPosition = rightGuess.indexOf(currentGuess[i]);
    if (letterPosition === -1) {
      letterColor = `${s} `;
    } else {
      if (currentGuess[i] === rightGuess[i]) {
        letterColor = `${g} `;
      } else {
        letterColor = `${b} `;
      }

      rightGuess[letterPosition] = "#";
    }

    // Store feedback for each letter
    feedback += letterColor;
  }

  return feedback;
};
