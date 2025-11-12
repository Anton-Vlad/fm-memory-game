export class UI {
  constructor() {
    this.settingsPanel = null;
    this.boardPanel = null;
    this.resultModal = null;
    this.gameBoard = null;
    this.infoPanel = null;
  }

  init() {
    this.settingsPanel = document.getElementById("settings-panel");
    this.boardPanel = document.getElementById("board-panel");
    this.resultModal = document.getElementById("results-modal");
    this.gameBoard = document.getElementById("game-board");
    this.infoPanel = document.getElementById("game-info");
    this.cleanInfoPanel();
  }

  showResultsModal(settings, movesCount, timeElapsed) {
    if (settings.playersCount > 1) {
        this.populateMultiplayerResults(movesCount, timeElapsed);
    } else {
        this.populateSingleplayerResults(movesCount, timeElapsed);
    }

    this.resultModal.showModal();
  }

  populateMultiplayerResults(movesCount, timeElapsed) {
    return ``;
  }

  populateSingleplayerResults(movesCount, timeElapsed) {
    this.resultModal.querySelector("h2").textContent = "You did it!";
    this.resultModal.querySelector("p.suttitle").innerHTML = `Game over! Here’s how you got on…`;
    const resultsTable = this.resultModal.querySelector(".results-table");
    resultsTable.innerHTML = "";

    const timeEllapesedRow = document.createElement("div");
    timeEllapesedRow.className = "custom-bg-blue-100 rounded-md px-4 py-3 flex flex-col basis-1/2 items-center justify-between sm:flex-row";
    timeEllapesedRow.innerHTML = `
        <label>Time Elapsed</label>
        <span class="text-2xl text-color-800">${timeElapsed}</span>
    `;
    const movesMadeRow = document.createElement("div");
    movesMadeRow.className = "custom-bg-blue-100 rounded-md px-4 py-3 flex flex-col basis-1/2 items-center justify-between sm:flex-row";
    movesMadeRow.innerHTML = `
        <label>Moves Taken</label>
        <span class="text-2xl text-color-800">${movesCount} Moves</span>
    `;

    resultsTable.appendChild(timeEllapesedRow);
    resultsTable.appendChild(movesMadeRow);

    const formActions = this.resultModal.querySelector("form");
    formActions.innerHTML = ``;

    const restartBtn = document.createElement("button");
    restartBtn.type = "button";
    restartBtn.className = "button primary inline restartGame text-md basis-1/2";
    restartBtn.textContent = "Restart";
    
    const newGameBtn = document.createElement("button");
    newGameBtn.type = "button";
    newGameBtn.className = "button inline text-md endCurrentGame basis-1/2 text-color-800";
    newGameBtn.textContent = "Setup New Game";

    formActions.appendChild(restartBtn);
    formActions.appendChild(newGameBtn);
  }

  showSettingsPanel() {
    this.settingsPanel.classList.add("flex");
    this.settingsPanel.classList.remove("hidden");
    this.boardPanel.classList.add("hidden");
    this.boardPanel.classList.remove("block");
  }

  showBoardPanel() {
    this.settingsPanel.classList.add("hidden");
    this.settingsPanel.classList.remove("flex");
    this.boardPanel.classList.add("block");
    this.boardPanel.classList.remove("hidden");
  }

  showInfoPanel(settings) {
    const timeDisplay = document.createElement("div");
    timeDisplay.className =
      "custom-bg-blue-100 rounded-md p-2 flex flex-col basis-1/2 items-center justify-between sm:flex-row sm:p-5";
    timeDisplay.id = "game-time";
    timeDisplay.innerHTML = `
        <label for="time-ellapsed">Time:</label>
        <span class="text-xl" id="time-ellapsed">
            <span id="minutes">0</span>:<span id="seconds">00</span>
        </span>
    `;

    const movesDisplay = document.createElement("div");
    movesDisplay.className =
      "custom-bg-blue-100 rounded-md p-2 flex flex-col basis-1/2 items-center justify-between sm:flex-row sm:p-5";
    movesDisplay.id = "game-moves";
    movesDisplay.innerHTML = `
        <label for="moves-made">Moves:</label>
        <span class="text-xl" id="moves-made">
            0
        </span>
    `;

    this.infoPanel.appendChild(timeDisplay);
    this.infoPanel.appendChild(movesDisplay);
  }

  updateScoreMoves(movesCount) {
    const movesMadeElement = document.getElementById("moves-made");
    if (movesMadeElement) {
      movesMadeElement.textContent = movesCount.toString();
    }
  }

  updateTimerDisplay(minutes, seconds) {
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    if (minutesElement && secondsElement) {
      minutesElement.textContent = minutes.toString();
      secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
  }

  cleanInfoPanel() {
    this.infoPanel.innerHTML = "";
  }

  updateSettingsState(settings) {
    this.settingsPanel.querySelectorAll(".setting-button").forEach((button) => {
      button.classList.remove("selected");
    });

    for (const [setting, value] of Object.entries(settings)) {
      const button = this.settingsPanel.querySelector(
        `.setting-button[data-setting="${setting}"][data-value="${value}"]`
      );
      if (button) {
        button.classList.add("selected");
      }
    }
  }

  flipTile(tileElement) {
    tileElement.classList.add("active");

    setTimeout(() => {
      tileElement.classList.add("flipped");
    }, 200);
  }

  flipTilesBack(tileElement, previousTileId) {
    const previousTileElement = this.getTileElementById(previousTileId);

    tileElement.classList.remove("flipped");
    previousTileElement.classList.remove("flipped");

    setTimeout(() => {
      tileElement.classList.remove("active");
      previousTileElement.classList.remove("active");
    }, 200);
  }

  keepTilesFlipped(tileElement, previousTileId) {
    const previousTileElement = this.getTileElementById(previousTileId);

    tileElement.classList.add("matched");
    previousTileElement.classList.add("matched");
  }

  getTileElementById(tileId) {
    const tileElement = this.gameBoard.querySelector(
      `.tile[data-id="${tileId}"]`
    );

    if (!tileElement) {
      console.error("Tile element not found for id:", tileId);
      throw new Error("Tile element not found");
    }

    return tileElement;
  }

  renderTiles(tiles) {
    this.gameBoard.innerHTML = "";
    this.gameBoard.classList.add(`grid-cols-${Math.sqrt(tiles.length)}`);
    this.gameBoard.classList.add(`grid-rows-${Math.sqrt(tiles.length)}`);

    let smFontSizeClass = "text-xl";
    if (tiles.length <= 16) {
      smFontSizeClass = "text-3xl";
    }
    let defaultFontSizeClass = "text-3xl";
    if (tiles.length <= 16) {
      defaultFontSizeClass = "text-6xl";
    }

    for (const tile of tiles) {
      const tileElement = document.createElement("div");
      tileElement.className = `tile flex items-center justify-center font-semibold rounded-full ${smFontSizeClass} sm:${defaultFontSizeClass}`;
      tileElement.dataset.payload = tile.payload;
      tileElement.dataset.id = tile.id;

      const tileInner = document.createElement("div");
      tileInner.className = "tile-inner ";

      if (tile.type === 1) {
        tileInner.textContent = tile.payload;
      } else if (tile.type === 2) {
        const icon = document.createElement("i");
        icon.className = `fa ${tile.payload}`;
        tileInner.appendChild(icon);
      }

      tileElement.appendChild(tileInner);
      this.gameBoard.appendChild(tileElement);
    }
  }
}
