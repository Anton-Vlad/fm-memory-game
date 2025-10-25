class App {
  constructor() {
    this.ui = null;
    this.timer = null;
    this.gameType = null;
    this.players = [];
    this.state = 0; // 0: start, 1: playing, 2: ended

    console.log("App constructed");
  }

  init() {
    console.log("App init called");
  }

  isMultiplayer() {
    return this.gameType === "multiplayer";
  }

  isRunning() {
    return this.state === 1;
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
