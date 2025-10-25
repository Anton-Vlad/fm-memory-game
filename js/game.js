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
  }

  isMultiplayer() {
    return this.playersCount > 1;
  }

  isVictory() {
    return false;
  }

  makeMove(tile) {
    if (this.moveStarted) {
      this.endMove(tile);
    } else {
      this.startMove(tile);
    }
  }

  start() {


    console.log("Game started with settings:", {
      size: this.size,
      theme: this.theme,
      playersCount: this.playersCount,
    });
  }
}
