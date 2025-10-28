import { ICONS } from "./icons.js";

export class Game {
  constructor(settings) {
    this.size = settings.size;
    this.theme = settings.theme;
    this.playersCount = settings.playersCount;
    this.tiles = [];
    this.timer = null;

    this.moveStarted = false;
    this.tileToMatch = null;
    this.matchCount = 0;

    this.movesCount = 0;
    this.timeElapsed = 0;
    // this.matchedPairs = 0; // per player in multiplayer mode

    this.usedIconsIndexex = [];
  }

  isMultiplayer() {
    return this.playersCount > 1;
  }

  isVictory() {
    return this.matchCount === (this.size * this.size) / 2;
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
        payload: this.theme === 1 ? i : this.getRandomIcon(),
        flipped: false,
        matched: false,
      });
    }
    for (let i = 1; i <= totalTiles / 2; i++) {
      this.tiles.push({
        id: totalTiles / 2 + i,
        type: this.theme,
        payload: this.theme === 1 ? i : ICONS[this.usedIconsIndexex[i - 1]],
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

  makeMove(tileId) {
    console.log("TILES", this.tiles);
    const tile = this.tiles.filter((x) => x.id === tileId)[0];
    console.log("Tile clicked:", tile);
    if (this.moveStarted) {
      return this.endMove(tile);
    } else {
      return this.startMove(tile);
    }
  }

  // returns the outcome , in this case always 1 - successful start move
  startMove(tile) {
    this.moveStarted = true;
    this.tileToMatch = tile;

    this.tileToMatch.matched = false;
    this.tileToMatch.flipped = true;
    console.log("Move started with tile:", tile);

    return { outcome: 1 };
  }

  // returns the outcome , 2 - tiles match & endGame, 3 - tiles do not match, 4 - tiles match
  endMove(tile) {
    const previousTileId = this.tileToMatch.id;
    this.movesCount += 1;
    tile.flipped = true;
    console.log("Move ended with tile:", { tile, prev: this.tileToMatch });

    if (
      this.tileToMatch.payload === tile.payload &&
      this.tileToMatch !== tile
    ) {
      for (let t = 0; t < this.tiles.length; t++) {
        if ([previousTileId, tile.id].includes(this.tiles[t].id)) {
          this.tiles[t].flipped = false;
          this.tiles[t].matched = true;
        }
      }

      this.matchCount += 1;
      this.moveStarted = false;
      this.tileToMatch = null;
      return this.isVictory()
        ? { outcome: 2, tileState: this.tiles, previousTileId }
        : { outcome: 4, tileState: this.tiles, previousTileId };
    }

    this.moveStarted = false;
    this.tileToMatch = null;
    for (let t = 0; t < this.tiles.length; t++) {
      if ([previousTileId, tile.id].includes(this.tiles[t].id)) {
        this.tiles[t].flipped = false;
        this.tiles[t].matched = false;
      }
    }
    return { outcome: 3, tileState: this.tiles, previousTileId };
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
