import {
  twoLetterDictionary,
  threeLetterDictionary,
  fourLetterDictionary,
  fiveLetterDictionary,
} from "./dictionary.js";

const TOTAL_ROWS = 6;
const TOTAL_COLS = 5;

// Pick the right dictionary based on the word length
let dictionary = [];

if (TOTAL_COLS === 2) dictionary = twoLetterDictionary;
else if (TOTAL_COLS === 3) dictionary = threeLetterDictionary;
else if (TOTAL_COLS === 4) dictionary = fourLetterDictionary;
else if (TOTAL_COLS === 5) dictionary = fiveLetterDictionary;
else alert("No dictionary found for this word length.");

const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(TOTAL_ROWS)
    .fill()
    .map(() => Array(TOTAL_COLS).fill("")),
  currentRow: 0,
  currentCol: 0,
};

console.log("Secret word:", state.secret);

const startMenu = document.getElementById("StartMenu");
const gameMenu = document.getElementById("game");
const startButton = document.getElementById("Start-Round");
const board = document.querySelector("#game .grid");

// Put the game board on the screen
function drawGrid() {
  board.innerHTML = "";

  for (let row = 0; row < TOTAL_ROWS; row++) {
    for (let col = 0; col < TOTAL_COLS; col++) {
      const box = document.createElement("div");
      box.className = "box";
      box.id = `box${row}${col}`;
      board.appendChild(box);
    }
  }
}

// Copy the letters from state.grid onto the screen
function updateGrid() {
  for (let row = 0; row < TOTAL_ROWS; row++) {
    for (let col = 0; col < TOTAL_COLS; col++) {
      const box = document.getElementById(`box${row}${col}`);
      box.textContent = state.grid[row][col];
    }
  }
}

// Get the word the player is typing on the current row
function getCurrentWord() {
  return state.grid[state.currentRow].join("");
}

// Check if a word is in the dictionary
function isWordValid(word) {
  return dictionary.includes(word);
}

// Check if a key is a letter
function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

// Add one letter to the current row
function addLetter(letter) {
  if (state.currentCol === TOTAL_COLS) return;

  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

// Remove one letter from the current row
function removeLetter() {
  if (state.currentCol === 0) return;

  state.currentCol--;
  state.grid[state.currentRow][state.currentCol] = "";
}

// Count how many times a letter appears in a word
function countLetter(word, letter) {
  let count = 0;

  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) count++;
  }

  return count;
}

// Count which copy of a letter this is in a word
function getLetterPosition(word, letter, position) {
  let count = 0;

  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) count++;
  }

  return count;
}

// Show green / yellow / gray tiles
function revealWord(guess) {
  const row = state.currentRow;
  const animationDuration = 500;

  for (let col = 0; col < TOTAL_COLS; col++) {
    const box = document.getElementById(`box${row}${col}`);
    const letter = box.textContent;

    const secretCount = countLetter(state.secret, letter);
    const guessCount = countLetter(guess, letter);
    const letterPos = getLetterPosition(guess, letter, col);

    setTimeout(
      () => {
        if (guessCount > secretCount && letterPos > secretCount) {
          box.classList.add("empty");
        } else if (letter === state.secret[col]) {
          box.classList.add("right");
        } else if (state.secret.includes(letter)) {
          box.classList.add("wrong");
        } else {
          box.classList.add("empty");
        }
      },
      ((col + 1) * animationDuration) / 2,
    );

    box.classList.add("animated");
    box.style.animationDelay = `${(col * animationDuration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === TOTAL_ROWS - 1;

  setTimeout(() => {
    if (isWinner) {
      alert("Congratulations!");
    } else if (isGameOver) {
      alert(`Better luck next time! The word was ${state.secret}.`);
    }
  }, 3 * animationDuration);
}

// Keyboard controls
function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;

    if (state.currentRow >= TOTAL_ROWS) return;

    if (key === "Enter") {
      if (state.currentCol === TOTAL_COLS) {
        const word = getCurrentWord();

        if (isWordValid(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert("Not a valid word.");
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

// Show the game
function startGame() {
  startMenu.style.display = "none";
  gameMenu.style.display = "grid";
}

// Start everything
function startup() {
  gameMenu.style.display = "none";

  document.documentElement.style.setProperty("--rows", TOTAL_ROWS);
  document.documentElement.style.setProperty("--cols", TOTAL_COLS);

  drawGrid();
  registerKeyboardEvents();
}

startButton.addEventListener("click", startGame);
startup();
