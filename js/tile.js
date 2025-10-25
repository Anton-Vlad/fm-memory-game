class Tile {
  constructor(payload, htmlElement, type = "text") {
    this.isFlipped = false;
    this.isMatched = false;
    this.payload = payload;
    this.type = type;
    this.htmlElement = htmlElement;
  }

  setMatched(matched) {
    this.isMatched = matched;
  }

  show() {
    this.isFlipped = true;

    // Update HTML element to show payload
    // this.htmlElement.classList.add("shown");
  }

  hide() {
    this.isFlipped = false;

    // Update HTML element to show payload
    // this.htmlElement.classList.remove("shown");
  }
}
