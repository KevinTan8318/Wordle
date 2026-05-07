// 1. Get the canvas and its 2D context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 2. Set colors
ctx.fillStyle = 'blue';    // For solid boxes
ctx.strokeStyle = 'red';   // For outlines
ctx.lineWidth = 5;         // Thickness of the outline

// 3. Draw the boxes: (x, y, width, height)
ctx.fillRect(50, 50, 150, 100);    // Draws a solid blue box
ctx.strokeRect(250, 50, 150, 100); // Draws a red outline box


import {
  twoLetterDictionary,
  threeLetterDictionary,
  fourLetterDictionary,
  fiveLetterDictionary
} from './dictionary.js';

const TOTAL_ROWS = 6; // How many rows (down)
const TOTAL_COLS = 5; // How many colums (left to right)


// Gets the dictionary of whatever is needed
let dictionary = [];

if (TOTAL_COLS === 2) {
  dictionary = twoLetterDictionary;
}
else if (TOTAL_COLS === 3) {
  dictionary = threeLetterDictionary;
}
else if (TOTAL_COLS === 4) {
  dictionary = fourLetterDictionary;
}
else if (TOTAL_COLS === 5) {
  dictionary = fiveLetterDictionary;
}
else {
  alert("There was no dictionary found. An error occured from rows or colums");
}

const state = {

  // Picks a random word
  // gets random decimal, multiply by dictionarys total words
  // and rounds it to whole number like dictionary[380]
  secret: dictionary[
    Math.floor(Math.random() * dictionary.length)
  ],

  // Creates rows + columns depending on variables
  grid: Array(TOTAL_ROWS)
    .fill()
    .map(() => Array(TOTAL_COLS).fill('')),

  currentRow: 0,
  currentCol: 0,
};

function drawGrid(container) {

  const grid = document.createElement('div'); // create a new div with a class named grid
  grid.className = 'grid';

  // Creates required amount of boxes
  for (let i = 0; i < TOTAL_ROWS; i++) {

    for (let j = 0; j < TOTAL_COLS; j++) {

      
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid); // adds the div to the container thats called
}



function updateGrid() {

  // Loops through every row + column
  for (let i = 0; i < state.grid.length; i++) {

    for (let j = 0; j < state.grid[i].length; j++) {

      // Gets specific box
      const box =
        document.getElementById(`box${i}${j}`);

      // Updates visible text
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {

  // Creates one box
  const box = document.createElement('div');

  box.className = 'box';

  box.textContent = letter;

  // Gives every box unique id
  // Example: box23
  box.id = `box${row}${col}`;

  container.appendChild(box);

  return box;
}

function registerKeyboardEvents() {

  // Runs every time keyboard key is pressed
  document.body.onkeydown = (e) => {

    const key = e.key;

    // Stops typing after game ends
    if (state.currentRow >= TOTAL_ROWS) {
      return;
    }

    // ENTER KEY
    if (key === 'Enter') {

      // Only submit if row is full
      if (state.currentCol === TOTAL_COLS) {

        const word = getCurrentWord();

        if (isWordValid(word)) {

          revealWord(word);

          // Move to next row
          state.currentRow++;

          state.currentCol = 0;

        } else {

          alert('Not a valid word.');
        }
      }
    }

    // BACKSPACE
    if (key === 'Backspace') {

      removeLetter();
    }

    // LETTERS
    if (isLetter(key)) {

      addLetter(key.toLowerCase());
    }

    // Updates screen
    updateGrid();
  };
}

function getCurrentWord() {

  // Turns array into full word
  // ['h','e','l','l','o'] -> "hello"
  return state.grid[state.currentRow].reduce(
    (prev, curr) => prev + curr
  );
}

function isWordValid(word) {

  // Checks if word exists in dictionary
  return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {

  // Counts how many times letter appears
  let result = 0;

  for (let i = 0; i < word.length; i++) {

    if (word[i] === letter) {

      result++;
    }
  }

  return result;
}

function getPositionOfOccurrence(
  word,
  letter,
  position
) {

  // Handles duplicate letter logic
  let result = 0;

  for (let i = 0; i <= position; i++) {

    if (word[i] === letter) {

      result++;
    }
  }

  return result;
}

function revealWord(guess) {

  const row = state.currentRow;

  const animation_duration = 500; // ms

  // Loops through all letters
  for (let i = 0; i < TOTAL_COLS; i++) {

    const box =
      document.getElementById(`box${row}${i}`);

    const letter = box.textContent;

    const numOfOccurrencesSecret =
      getNumOfOccurrencesInWord(
        state.secret,
        letter
      );

    const numOfOccurrencesGuess =
      getNumOfOccurrencesInWord(
        guess,
        letter
      );

    const letterPosition =
      getPositionOfOccurrence(
        guess,
        letter,
        i
      );

    // Delays reveal animation
    setTimeout(() => {

      // Duplicate letter handling
      if (
        numOfOccurrencesGuess >
          numOfOccurrencesSecret &&
        letterPosition >
          numOfOccurrencesSecret
      ) {

        // Gray
        box.classList.add('empty');

      } else {

        // Green
        if (letter === state.secret[i]) {

          box.classList.add('right');

        // Yellow
        } else if (
          state.secret.includes(letter)
        ) {

          box.classList.add('wrong');

        // Gray
        } else {

          box.classList.add('empty');
        }
      }

    }, ((i + 1) * animation_duration) / 2);

    // Flip animation
    box.classList.add('animated');

    box.style.animationDelay =
      `${(i * animation_duration) / 2}ms`;
  }

  // Win condition
  const isWinner = state.secret === guess;

  // Lose condition
  const isGameOver =
    state.currentRow === TOTAL_ROWS - 1;

  setTimeout(() => {

    if (isWinner) {

      alert('Congratulations!');

    } else if (isGameOver) {

      alert(
        `Better luck next time! The word was ${state.secret}.`
      );
    }

  }, 3 * animation_duration);
}

function isLetter(key) {

  // Checks if key is alphabet letter
  return key.length === 1 &&
    key.match(/[a-z]/i);
}

function addLetter(letter) {

  // Stops typing if row full
  if (state.currentCol === TOTAL_COLS) {
    return;
  }

  // Adds letter to grid
  state.grid[state.currentRow][state.currentCol] =
    letter;

  state.currentCol++;
}

function removeLetter() {

  // Stops deleting if at beginning
  if (state.currentCol === 0) {
    return;
  }

  // Removes previous letter
  state.grid[state.currentRow][
    state.currentCol - 1
  ] = '';

  state.currentCol--;
}

function startup() {
  // 1. Set the CSS variables on the :root (documentElement)
  document.documentElement.style.setProperty('--rows', TOTAL_ROWS);
  document.documentElement.style.setProperty('--cols', TOTAL_COLS);

  // Gets game container
  const game = document.getElementById('game');

  // Draws board
  drawGrid(game);

  // Starts keyboard input
  registerKeyboardEvents();
}

// Starts game
startup();