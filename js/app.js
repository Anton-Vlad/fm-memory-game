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

  makeMove(tileId, tileElement) {
    const { outcome, tileState, previousTileId } = this.game.makeMove(tileId);
    console.log("Move outcome:", { outcome, tileState, previousTileId });

    // Act based on outcome, and update UI accordingly
    switch (outcome) {
      case 1: // Move started
        this.ui.flipTile(tileElement);
        break;
      case 2: // Tiles match & endGame
        setTimeout(() => {
          this.ui.keepTilesFlipped(tileElement, previousTileId);
          this.ui.updateScoreMoves(this.game.movesCount);
        }, 1000);

        setTimeout(() => {
            console.log("Game would end now.");
             // this.ui.endGame()
        }, 3000);
        break;
      case 3: // Tiles do not match
        this.ui.flipTile(tileElement);
        setTimeout(() => {
          this.ui.flipTilesBack(tileElement, previousTileId);
          this.ui.updateScoreMoves(this.game.movesCount);
        }, 2000);
        console.log("Tiles DO NOT MATCH, & would flip back now.");
        break;
      case 4: // Tiles match & not endGame
        this.ui.flipTile(tileElement);
        setTimeout(() => {
          this.ui.keepTilesFlipped(tileElement, previousTileId);
          this.ui.updateScoreMoves(this.game.movesCount);
        }, 1000);
        console.log("Tiles DO MATCH, keep them flipped.");
        break;
      default:
        console.log("Unknown move outcome:", moveOutcome);
    }

    console.log(
      "Current game state:",
      this.game.movesCount,
      this.game.matchCount
    );
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();

  app.startGame();
});
