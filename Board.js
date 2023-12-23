import { Gem } from "./Gem";
import { Container, Point } from "pixi.js";
import { swapElements2D } from "./helpers";
import { Text } from "pixi.js";
import { cellSize } from "./main";

export default class Board {
  constructor(rows, cols) {
    this.gems = [];
    this.container = new Container();
    this.selectedGem = null;
    this.targetGem = null;
    for (var i = 0; i < cols; i++) {
      this.gems.push([]);
      this.gems[i].push(new Array(rows));
      for (var j = 0; j < rows; j++) {
        const gem = new Gem(new Point(i, j), this);
        this.gems[i][j] = gem;
        gem.scale.set(cellSize / gem.width, cellSize / gem.height);
        gem.position.set(i * cellSize, j * cellSize);
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
        board.selectedGem.deselect();
        if (board.adjacent(board.selectedGem, targetGem)) {
          board.targetGem = targetGem;
          board.swap(board.selectedGem, board.targetGem);
        } else {
          board.selectedGem = null;
        }
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

  swap(gem1, gem2) {
    const i1 = gem1.boardCoords.x;
    const j1 = gem1.boardCoords.y;
    const i2 = gem2.boardCoords.x;
    const j2 = gem2.boardCoords.y;
    swapElements2D(this.gems, i1, j1, i2, j2);

    const gem1Coords = gem1.boardCoords;
    gem1.boardCoords = gem2.boardCoords;
    gem2.boardCoords = gem1Coords;
  }
}
