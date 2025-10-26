import { ICONS } from "./icons.js";

export class Game {
  constructor(settings) {
    this.size = settings.size;
    this.theme = settings.theme;
    this.playersCount = settings.playersCount;
    this.tiles = [];
    this.timer = null;

    this.moveStarted = false;

    this.movesCount = 0;
    this.timeElapsed = 0;
    // this.matchedPairs = 0; // per player in multiplayer mode

    this.usedIconsIndexex = [];
  }

  isMultiplayer() {
    return this.playersCount > 1;
  }

  isVictory() {
    return false;
  }

  getRandomIcon() {
    let iconIndex = Math.floor(Math.random() * ICONS.length);
    while (this.usedIconsIndexex.includes(iconIndex)) {
      iconIndex = Math.floor(Math.random() * ICONS.length);
    }
    this.usedIconsIndexex.push(iconIndex);
    return ICONS[iconIndex];
  }

  initializeTiles() {
    // Initialize tiles based on game size and theme
    this.tiles = [];
    const totalTiles = this.size * this.size;
    for (let i = 1; i <= totalTiles / 2; i++) {
      this.tiles.push({
        id: i,
        type: this.theme,
        payload: (this.theme === 1 ? i : this.getRandomIcon()),
        flipped: false,
        matched: false,
      });
    }
    for (let i = 1; i <= totalTiles / 2; i++) {
      this.tiles.push({
        id: (totalTiles / 2) + i,
        type: this.theme,
        payload: (this.theme === 1 ? i : ICONS[this.usedIconsIndexex[i - 1]]),
        flipped: false,
        matched: false,
      });
    }

    // Shuffle tiles
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
  }

  makeMove(tile) {
    // if (this.moveStarted) {
    //   this.endMove(tile);
    // } else {
    //   this.startMove(tile);
    // }
    console.log("Tile clicked:", tile);
  }

  start() {
    this.initializeTiles();

    console.log("Game started with settings:", {
      size: this.size,
      theme: this.theme,
      playersCount: this.playersCount,
      tiles: this.tiles,
    });

    return this.tiles;
  }
}
