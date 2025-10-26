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
    // this.resultModal = document.getElementById("result-modal");
    this.gameBoard = document.getElementById("game-board");
    this.infoPanel = document.getElementById("game-info");
    this.cleanInfoPanel();
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

  showInfoPanel() {
    const timeDisplay = document.createElement("div");
    timeDisplay.className =
      "custom-bg-blue-100 rounded-md p-2 flex flex-col basis-1/2 items-center justify-between sm:flex-row sm:p-5";
    timeDisplay.id = "game-time";
    timeDisplay.innerHTML = `
        <label for="time-ellapsed">Time:</label>
        <span class="text-xl" id="time-ellapsed">
            <span id="minutes">0</span>:<span id="seconds">01</span>
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
}
