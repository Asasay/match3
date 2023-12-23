import { Gem } from "./Gem";
import { Container, Point } from "pixi.js";
import { swapElements2D } from "./helpers";
import { Text } from "pixi.js";

export default class Board {
  constructor(rows, cols) {
    this.gems = [];
    this.container = new Container();
    this.selectedGem = null;
    for (var i = 0; i < rows; i++) {
      this.gems.push([]);
      this.gems[i].push(new Array(cols));
      for (var j = 0; j < cols; j++) {
        const gem = new Gem(new Point(i, j), this);
        this.gems[i][j] = gem;
        gem.scale.set(0.5, 0.5);
        gem.position.set(i * 128, j * 128);
        this.container.addChild(gem);

        gem.text = new Text(i + ", " + j);
        gem.text.zIndex = 999;
        gem.text.position = gem.position;
        this.container.sortableChildren = true;
        this.container.addChild(gem.text);

        gem.eventMode = "static";
        gem.cursor = "pointer";
        gem.on("pointerdown", this.handleSelect(this));
      }
    }
  }

  handleSelect(board) {
    return function () {
      const targetGem = this;
      if (board.selectedGem) {
        if (board.adjacent(board.selectedGem, targetGem)) {
          board.swap(targetGem);
          if (!board.combo) board.swap(targetGem);
        }
        board.selectedGem.deselect();
        board.selectedGem = null;
      } else {
        targetGem.select();
        board.selectedGem = targetGem;
      }
    };
  }

  combo() {
    return false;
  }
  adjacent(gem1, gem2) {
    return gem1.boardCoords.subtract(gem2.boardCoords).magnitude() == 1;
  }

  swap(targetGem) {
    const i1 = this.selectedGem.boardCoords.x;
    const j1 = this.selectedGem.boardCoords.y;
    const i2 = targetGem.boardCoords.x;
    const j2 = targetGem.boardCoords.y;
    swapElements2D(this.gems, i1, j1, i2, j2);

    const selectedCoords = this.selectedGem.boardCoords;
    this.selectedGem.boardCoords = targetGem.boardCoords;
    targetGem.boardCoords = selectedCoords;
  }
}
