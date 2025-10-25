export class UI {
  constructor() {
    this.settingsPanel = null;
    this.boardPanel = null;
    this.resultModal = null;
  }

  init() {
    this.settingsPanel = document.getElementById("settings-panel");
    this.boardPanel = document.getElementById("board-panel");
    // this.resultModal = document.getElementById("result-modal");
  }

  showSettingsPanel() {
    this.settingsPanel.classList.add("flex");
    this.settingsPanel.classList.remove("hidden");
    this.boardPanel.classList.add("hidden");
    this.boardPanel.classList.remove("flex");
  }

  showBoardPanel() {
    this.settingsPanel.classList.add("hidden");
    this.settingsPanel.classList.remove("flex");
    this.boardPanel.classList.add("flex");
    this.boardPanel.classList.remove("hidden");
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
