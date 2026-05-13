import {
  twoLetterDictionary,
  threeLetterDictionary,
  fourLetterDictionary,
  fiveLetterDictionary,
} from "./dictionary.js";

let TOTAL_ROWS = 6;
let TOTAL_COLS = 5;
let isRapidFire = false;
let currentStreak = 0;
let dictionary = [];

if (TOTAL_COLS === 2) dictionary = twoLetterDictionary;
else if (TOTAL_COLS === 3) dictionary = threeLetterDictionary;
else if (TOTAL_COLS === 4) dictionary = fourLetterDictionary;
else if (TOTAL_COLS === 5) dictionary = fiveLetterDictionary;
else console.log("No dictionary found for this word length.");

const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)], // Selects a random word from the dictionary

  grid: Array(TOTAL_ROWS)
    .fill()
    .map(() => Array(TOTAL_COLS).fill("")),

  // [ NOTE FOR LATER, the grid looks like this:
  //   ["", "", "", "", ""], // Row 0
  //   ["", "", "", "", ""], // Row 1
  //   ["", "", "", "", ""], // ...
  // ]

  currentRow: 0,
  currentCol: 0,
  roundOver: false,
};

console.log("Secret word:", state.secret);

const startMenu = document.getElementById("StartMenu");
const gameMenu = document.getElementById("game");
const modesMenu = document.getElementById("modes");
const startButton = document.getElementById("Start-Round");
const exitButton = document.getElementById("ExitBtn");
const modesButton = document.getElementById("ModesButton");
const board = document.querySelector("#game .grid"); // Find the grid div

const totalRowsButton = document.getElementById("totalRowsButton");
const totalLengthButton = document.getElementById("totalLengthButton");
const totalRowsLabel = document.getElementById("totalRowsLabel");
const totalLengthLabel = document.getElementById("totalLengthLabel");

const rapidFireButton = document.getElementById("rapidFireButton");
const StreakLabel = document.getElementById("Streak");

function drawGrid() {
  board.innerHTML = ""; // clear anything thats already there

  for (let row = 0; row < TOTAL_ROWS; row++) {
    for (let col = 0; col < TOTAL_COLS; col++) {
      const box = document.createElement("div"); // makes the new div
      box.className = "box"; // gives it the box class to make it look nice
      box.id = `box${row}${col}`; // gives it an id depending on the position
      board.appendChild(box); // add the new box to the div
    }
  }
}

function updateGrid() {
  for (let row = 0; row < TOTAL_ROWS; row++) {
    for (let col = 0; col < TOTAL_COLS; col++) {
      const box = document.getElementById(`box${row}${col}`);
      box.textContent = state.grid[row][col]; // makes letter show up
    }
  }
}

function getCurrentWord() {
  return state.grid[state.currentRow].join(""); // joins the words together from h e y to hey
}

function isWordValid(word) {
  return dictionary.includes(word); // check if the word IS a word
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i); // check if its ONE letter and a letter from a to z
}

function addLetter(letter) {
  if (state.currentCol === TOTAL_COLS) return;

  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++; // moves over one spot if theres space
}

function removeLetter() {
  if (state.currentCol === 0) return;

  state.currentCol--;
  state.grid[state.currentRow][state.currentCol] = ""; // removes the letter
}

function countLetter(word, letter) {
  // checks how many repeats in a letter.
  let count = 0;

  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) count++;
  }

  return count;
}
// TEST: console.log(countLetter("banana", "a"));

function getLetterPosition(word, letter, position) {
  let count = 0;

  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) count++;
  }

  return count;
}
// console.log(getLetterPosition("poops", "o", 3));

function revealWord(guess) {
  // check if they got it right (idk) + play animation?
  const row = state.currentRow;
  const animationDuration = 500;

  for (let col = 0; col < TOTAL_COLS; col++) {
    const box = document.getElementById(`box${row}${col}`);
    const letter = box.textContent;

    const secretCount = countLetter(state.secret, letter);
    const guessCount = countLetter(guess, letter);
    const letterPos = getLetterPosition(guess, letter, col);

    setTimeout(() => {
      if (guessCount > secretCount && letterPos > secretCount) {
        box.classList.add("empty");
      } else if (letter === state.secret[col]) {
        box.classList.add("right");
      } else if (state.secret.includes(letter)) {
        box.classList.add("wrong");
      } else {
        box.classList.add("empty");
      }
    }, ((col + 1) * animationDuration) / 2);

    box.classList.add("animated");
    box.style.animationDelay = `${(col * animationDuration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === TOTAL_ROWS - 1;

  if (isWinner || isGameOver) {
    if (isRapidFire == false) {
      state.roundOver = true;
    }
  }
  setTimeout(() => {
    if (isWinner) {
      console.log("Congratulations!");

      if (isRapidFire) {
        currentStreak++;
        StreakLabel.textContent = "Streak: " + currentStreak;
        setTimeout(resetGameRound, 1500);
      }
    } else if (isGameOver) {
      console.log(`Better luck next time! The word was ${state.secret}.`);

      if (isRapidFire) {
        alert(`Game Over! Final Streak: ${currentStreak}`);
        StreakLabel.innerHTML = "";
        isRapidFire = false;
        hideModesMenu();
      }
    }
  }, 3 * animationDuration);
}

function registerKeyboardEvents() {
  document.body.onkeydown = (input) => {
    if (state.roundOver) return;

    const key = input.key; // get which key they pressed

    if (state.currentRow >= TOTAL_ROWS) return; // ends if the row is full

    if (key === "Enter") {
      if (state.currentCol === TOTAL_COLS) {
        // if the row is full
        const word = getCurrentWord(); // get the word

        if (isWordValid(word)) {
          // check if the word is in the dictionary
          revealWord(word); // show what they got right and wrong
          state.currentRow++;
          state.currentCol = 0;
        } else {
          console.log("Not a valid word."); // they didnt input a word thats included in the dictionary
        }
      }
    }

    if (key === "Backspace") {
      removeLetter();
    }

    if (isLetter(key)) {
      addLetter(key.toLowerCase());
    }

    updateGrid();
  };
}

function startGame() {
  // show the main menu
  startMenu.style.display = "none";
  gameMenu.style.display = "grid";
}

function startup() {
  gameMenu.style.display = "none"; // hide everything and start the game
  modesMenu.style.display = "none";

  document.documentElement.style.setProperty("--rows", TOTAL_ROWS); // upd the css to the total rows
  document.documentElement.style.setProperty("--cols", TOTAL_COLS); // upd the css to the total columns

  drawGrid();
  registerKeyboardEvents();
}

function showModesMenu() {
  startMenu.style.display = "none";
  gameMenu.style.display = "none";
  modesMenu.style.display = "block";
}

function hideModesMenu() {
  startMenu.style.display = "flex";
  gameMenu.style.display = "none";
  modesMenu.style.display = "none";
}

function resetGameRound() {
  state.secret = dictionary[Math.floor(Math.random() * dictionary.length)];
  console.log("New Secret word: ", state.secret);

  state.currentRow = 0;
  state.currentCol = 0;
  state.grid = Array(TOTAL_ROWS)
    .fill()
    .map(() => Array(TOTAL_COLS).fill(""));

  drawGrid();

  document.documentElement.style.setProperty("--rows", TOTAL_ROWS); // upd the css to the total rows
  document.documentElement.style.setProperty("--cols", TOTAL_COLS); // upd the css to the total columns
}

function updateRows() {
  let inputRows = Number(totalRowsLabel.value);

  if (inputRows > 10) {
    inputRows = 10;
  } else if (inputRows < 1) {
    inputRows = 1;
  }

  totalRowsLabel.value = inputRows;
  TOTAL_ROWS = inputRows;

  resetGameRound();
}

function updateWordLength() {
  let wordLength = Number(totalLengthLabel.value);

  if (wordLength > 5) {
    wordLength = 5;
  } else if (wordLength < 2) {
    wordLength = 2;
  }

  totalLengthLabel.value = wordLength;
  TOTAL_COLS = wordLength;

  if (TOTAL_COLS === 2) dictionary = twoLetterDictionary;
  else if (TOTAL_COLS === 3) dictionary = threeLetterDictionary;
  else if (TOTAL_COLS === 4) dictionary = fourLetterDictionary;
  else if (TOTAL_COLS === 5) dictionary = fiveLetterDictionary;

  resetGameRound();
}

function startRapidFire() {
  console.log("Start Rapid Fire");
  isRapidFire = true;
  currentStreak = 0;
  StreakLabel.textContent = "Streak: " + currentStreak;
  hideModesMenu();
  startGame();
}

startButton.addEventListener("click", startGame);
modesButton.addEventListener("click", showModesMenu);
exitButton.addEventListener("click", hideModesMenu);
totalRowsButton.addEventListener("click", updateRows);
totalLengthButton.addEventListener("click", updateWordLength);
rapidFireButton.addEventListener("click", startRapidFire);

startup();
