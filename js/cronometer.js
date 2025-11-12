export class Cronometer {
  constructor(onTick) {
    this.ellapsedSeconds = 0;
    this.intervalId = null;
    this.onTick = onTick;
    this.isRunning = false;
  }

  // Start cronometer from 0:00
  start() {
    this.ellapsedSeconds = 0;
    this.isRunning = true;

    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Update display
    this.updateDisplay();

    // Start countdown
    this.intervalId = setInterval(() => {
      this.ellapsedSeconds++;
      this.updateDisplay();
    }, 1000);
  }

  // Stop timer
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.ellapsedSeconds = 0;
    this.isRunning = false;
    // this.updateDisplay();
  }

  // Update display
  updateDisplay() {
    const minutes = Math.floor(this.ellapsedSeconds / 60);
    const seconds = this.ellapsedSeconds % 60;

    if (this.onTick) {
      this.onTick(minutes, seconds);
    }
  }

  getSecondsElapsed() {
    return this.ellapsedSeconds;
  }

  getTimeElapsed() {
    const minutes = Math.floor(this.ellapsedSeconds / 60);
    const seconds = this.ellapsedSeconds % 60;

    return "" + minutes.toString() + ":" + seconds.toString().padStart(2, '0');
  }
}
