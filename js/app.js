import { UI } from "./ui.js";
import { Game } from "./game.js";

class App {
  constructor() {
    this.ui = new UI();
    this.game = null;
    this.settings = {
      size: 4,
      theme: 1, // 1 - numbers, 2 - icons
      playersCount: 1,
    };
  }

  init() {
    this.ui.init();
    this.ui.showSettingsPanel();
    this.ui.updateSettingsState(this.settings);

    this.setupEventListeners();
  }

  updateSetting(setting, value) {
    this.settings[setting] = parseInt(value);
    this.ui.updateSettingsState(this.settings);
  }

  // Setup all event listeners
  setupEventListeners() {
    // Handle all clicks with event delegation
    document.addEventListener("click", async (e) => {
      // Check if settings button was clicked
      if (e.target.closest(".setting-button:not(.selected)")) {
        const setting = e.target.closest(".setting-button").dataset.setting;
        const value = e.target.closest(".setting-button").dataset.value;
        this.updateSetting(setting, value);

        return;
      }

      if (e.target.closest(".startNewGame")) {
        this.startGame();
        return;
      }

      if (e.target.closest(".endCurrentGame")) {
        this.endGame();
        return;
      }
      
      if (e.target.closest(".restartGame")) {
        this.restartGame();
        return;
      }
      
      if (e.target.closest(".tile:not(.active)")) {
        const tileElement = e.target.closest(".tile:not(.active)");
        this.makeMove(tileElement);
        return;
      }

      console.log("No relevant button clicked");
    });
  }

  startGame() {
    this.game = new Game(this.settings);
    const tiles = this.game.start();

    this.ui.showInfoPanel(this.settings);
    this.ui.showBoardPanel();
    this.ui.renderTiles(tiles);
  }

  endGame() {
    this.game = null;

    // Reset the initial settings
    this.settings = {
      size: 4,
      theme: 1,
      playersCount: 1,
    };
    this.ui.updateSettingsState(this.settings);

    // Show settings panel and clean info panel
    this.ui.cleanInfoPanel();
    this.ui.showSettingsPanel();
  }

  restartGame() {
    this.game = new Game(this.settings);
    this.game.start();

    this.ui.cleanInfoPanel();
    this.ui.showInfoPanel(this.settings);
  }

  makeMove(tile) {

    this.game.makeMove(tile);

    this.ui.flipTile(tile);
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();

  app.startGame();
});
