const tableElement = document.getElementById("table");
const digits = document.getElementById("digits");
const timerElement = document.getElementById("timer");
const errorCountElement = document.getElementById("error-count");

let errorCount = 0;
let timerInterval = null;
let secondsElapsed = 0;
let selectedPuzzle = null;
let solution = null;
let activeSquare = null;
let selectedDigit = null;

const puzzles = {
  easy: [
    {
      puzzle: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ],
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ]
    }
  ],
  medium: [
    {
      puzzle: [
        [0, 0, 0, 0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 3, 5, 0, 0, 0],
        [0, 0, 9, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 2, 0],
        [0, 0, 0, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 3, 0, 0],
        [7, 0, 5, 0, 0, 0, 0, 9, 0],
        [0, 4, 0, 0, 0, 8, 0, 0, 0],
        [0, 0, 0, 0, 6, 0, 0, 0, 0]
      ],
      solution: [
        [4, 3, 7, 9, 8, 6, 5, 1, 2],
        [1, 8, 2, 4, 3, 5, 9, 6, 7],
        [5, 6, 9, 2, 7, 1, 4, 3, 8],
        [3, 5, 4, 8, 9, 7, 1, 2, 6],
        [2, 9, 1, 7, 6, 3, 8, 5, 4],
        [6, 7, 8, 5, 4, 2, 3, 9, 1],
        [7, 2, 5, 6, 1, 4, 9, 8, 3],
        [9, 4, 6, 3, 2, 8, 7, 1, 5],
        [8, 1, 3, 7, 5, 9, 6, 4, 2]
      ]
    }
  ],
  hard: [
    {
      puzzle: [
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 6, 0, 0, 0, 0, 0],
        [0, 7, 0, 0, 9, 0, 2, 0, 0],
        [0, 5, 0, 0, 0, 7, 0, 0, 0],
        [0, 0, 0, 0, 4, 5, 7, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 3, 0],
        [0, 0, 1, 0, 0, 0, 0, 6, 8],
        [0, 0, 8, 5, 0, 0, 0, 1, 0],
        [0, 9, 0, 0, 0, 0, 4, 0, 0]
      ],
      solution: [
        [8, 1, 2, 7, 5, 3, 6, 4, 9],
        [9, 4, 3, 6, 8, 2, 1, 7, 5],
        [6, 7, 5, 4, 9, 1, 2, 8, 3],
        [1, 5, 4, 2, 3, 7, 8, 9, 6],
        [3, 6, 9, 8, 4, 5, 7, 2, 1],
        [2, 8, 7, 1, 6, 9, 5, 3, 4],
        [5, 2, 1, 9, 7, 4, 3, 6, 8],
        [4, 3, 8, 5, 2, 6, 9, 1, 7],
        [7, 9, 6, 3, 1, 8, 4, 5, 2]
      ]
    }
  ]
};

function renderPuzzle(puzzle) {
  tableElement.innerHTML = "";
  activeSquare = null;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const square = document.createElement("div");
      square.classList.add("squares");
      if (puzzle[row][col] !== 0) {
        square.textContent = puzzle[row][col];
        square.classList.add("fixed");
      } else {
        square.contentEditable = true;
        square.inputMode = "numeric";
        square.setAttribute("data-row", row);
        square.setAttribute("data-col", col);
        square.addEventListener("click", () => {
          if (selectedDigit !== null) {
            placeNumber(square, row, col, selectedDigit);
            clearDigitSelection();
          } else {
            activeSquare = square;
          }
        });
        square.addEventListener("keydown", (e) => handleKeyDown(e, row, col));
      }
      tableElement.appendChild(square);
    }
  }
}

function handleKeyDown(event, row, col) {
  const key = event.key;
  if (key >= "1" && key <= "9") {
    event.preventDefault();
    const value = parseInt(key, 10);
    placeNumber(event.target, row, col, value);
  } else if (key === "Backspace") {
    event.preventDefault();
    event.target.textContent = "";
  } else {
    event.preventDefault();
  }
}

function showPlaceholderMessage() {
  tableElement.innerHTML = `<div class="placeholder">
    SELECT DIFFICULTY AND CLICK ON NEW GAME<br><br>
    How to Play?<br>
    1. Select difficulty level.<br>
    2. Click on New Game.<br>
    3. The timer will start once you click on New Game.<br>
    4. To enter a number:<br>
       - Either type directly into the square (a numeric keyboard will open<br> on mobile),<br>
       - Or select a digit from the panel on the right and then click the desired<br> square.<br>
    5. If the number is correct, the square turns green.<br>
    6. If the number is incorrect, square remains red.<br>
    7. Once started you can stop timer and table will disappear<br>
    8. It appears again if you click start timer.
  </div>`;
}

showPlaceholderMessage();

function placeNumber(square, row, col, value) {
  if (!value) return;
  square.textContent = value;
  if (value !== solution[row][col]) {
    errorCount++;
    errorCountElement.textContent = errorCount;
    square.style.color = "black";
    square.style.backgroundColor = "red";
  } else {
    square.style.color = "black";
    square.style.backgroundColor = "green";
    setTimeout(() => {
      square.style.backgroundColor = "";
      square.style.color = "";
    }, 1000);
    checkCompletion();
  }
  if (square === activeSquare) {
    activeSquare = null;
  }
}

function checkCompletion() {
  const squares = tableElement.querySelectorAll(".squares");
  for (let i = 0; i < squares.length; i++) {
    let row = Math.floor(i / 9);
    let col = i % 9;
    if (squares[i].textContent.trim() !== String(solution[row][col])) {
      return;
    }
  }
  showCongratulations();
}

function showCongratulations() {
    let overlay = document.createElement("div");
    overlay.className = "overlay";
  
    let messageBox = document.createElement("div");
    messageBox.className = "message-box";
  
    let message = document.createElement("p");
    message.className = "message";
    message.textContent = "🎉 Congratulations! You solved the Sudoku!";
  
    let errorMessage = document.createElement("p");
    errorMessage.textContent = `❌ Errors Made: ${errorCount}`;
  
    let timeMessage = document.createElement("p");
    timeMessage.textContent = `⏱️ Time Taken: ${timerElement.textContent.replace("Time: ", "")}`;
  
    let yayButton = document.createElement("button");
    yayButton.textContent = "Play Again";
    yayButton.addEventListener("click", () => {
      window.location.reload();
    });
  
    messageBox.appendChild(message);
    messageBox.appendChild(errorMessage);
    messageBox.appendChild(timeMessage);
    messageBox.appendChild(yayButton);
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
  }

function startGame() {
  errorCount = 0;
  secondsElapsed = 0;
  clearInterval(timerInterval);
  timerRunning = false;
  timerElement.textContent = "Time: 00:00";
  errorCountElement.textContent = `${errorCount}`;
  const difficulty = document.getElementById("difficulty").value;
  const randomIndex = Math.floor(Math.random() * puzzles[difficulty].length);
  selectedPuzzle = puzzles[difficulty][randomIndex].puzzle;
  solution = puzzles[difficulty][randomIndex].solution;
  renderPuzzle(selectedPuzzle);
  tableElement.style.display = "grid";
  startTimer();
}

let timerRunning = false;

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    timerElement.textContent = `Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);
}

function stopGame() {
  clearInterval(timerInterval);
  timerRunning = false;
  tableElement.style.display = "none";
}

function resumeTimer() {
  if (!timerRunning) {
    startTimer();
  }
  tableElement.style.display = "grid";
}

function clearDigitSelection() {
  selectedDigit = null;
  const digitBoxes = document.querySelectorAll(".numbers");
  digitBoxes.forEach(box => box.classList.remove("selected"));
}

for (let i = 1; i <= 9; i++) {
  const numberBox = document.createElement("div");
  numberBox.classList.add("numbers");
  numberBox.textContent = i;
  numberBox.addEventListener("click", () => {
    selectedDigit = i;
    const digitBoxes = document.querySelectorAll(".numbers");
    digitBoxes.forEach(box => box.classList.remove("selected"));
    numberBox.classList.add("selected");
  });
  digits.appendChild(numberBox);
}

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("stop-timer").addEventListener("click", stopGame);
document.getElementById("start-timer").addEventListener("click", resumeTimer);
