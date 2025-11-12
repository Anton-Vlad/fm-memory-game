import { UI } from "./ui.js";
import { Game } from "./game.js";
import { Cronometer } from "./cronometer.js";
import {
  START_MOVE_FLAG,
  FINAL_MOVE_FLAG,
  END_MOVE_FLAG,
  MATCH_MOVE_FLAG,
} from "./const.js";

class App {
  constructor() {
    this.ui = new UI();
    this.game = null;
    this.settings = {
      size: 4,
      theme: 1, // 1 - numbers, 2 - icons
      playersCount: 1,
    };

    // To be moved in the UpdateSettingsState method, to decide which timer or cronomter to use
    this.cronometer = new Cronometer((minutes, seconds) =>
      this.ui.updateTimerDisplay(minutes, seconds)
    );
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

      if (e.target.closest(".tile:not(.active):not(.matched)")) {
        const tileElement = e.target.closest(".tile");
        const tileId = parseInt(tileElement.dataset.id);
        this.makeMove(tileId, tileElement);
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
    this.cronometer.start();
  }

  endGame() {
    this.game = null;
    this.cronometer.stop();

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

    this.ui.cleanInfoPanel();
    this.ui.showInfoPanel(this.settings);

    const tiles = this.game.start();
    this.ui.renderTiles(tiles);
    this.cronometer.start();
  }

  makeMove(tileId, tileElement) {
    const { outcome, tileState, previousTileId } = this.game.makeMove(tileId);

    // Act based on outcome, and update UI accordingly
    switch (outcome) {
      case START_MOVE_FLAG:
        this.ui.flipTile(tileElement);
        break;
      case FINAL_MOVE_FLAG:
        setTimeout(() => {
          this.ui.keepTilesFlipped(tileElement, previousTileId);
          this.ui.updateScoreMoves(this.game.movesCount);
        }, 2000);

        setTimeout(() => {
          this.game.timeElapsed = this.cronometer.getTimeElapsed();
          this.cronometer.stop();
          this.ui.showResultsModal(
            this.settings,
            this.game.movesCount,
            this.game.timeElapsed
          );
          // save results in local storage or send to server
        }, 3000);
        break;
      case END_MOVE_FLAG:
        this.ui.flipTile(tileElement);
        setTimeout(() => {
          this.ui.flipTilesBack(tileElement, previousTileId);
          this.ui.updateScoreMoves(this.game.movesCount);
        }, 2000);
        break;
      case MATCH_MOVE_FLAG: // Tiles match & not endGame
        this.ui.flipTile(tileElement);
        setTimeout(() => {
          this.ui.keepTilesFlipped(tileElement, previousTileId);
          this.ui.updateScoreMoves(this.game.movesCount);
        }, 1000);
        break;
      default:
        console.log("Unknown move outcome:", moveOutcome);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();

  app.startGame();
});
