import { Gem } from "./Gem";
import { Container, Point } from "pixi.js";
import {
  findIndex2D,
  principalDiagonal,
  secondaryDiagonal,
  swapElements2D,
  transpose,
} from "./helpers";
import { Text } from "pixi.js";
import { cellSize } from "./main";

export default class Board {
  constructor(rows, cols) {
    this.gems = [];
    this.container = new Container();
    this.selectedGem = null;
    this.targetGem = null;
    this.swapped = false;
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
  checkCombo() {
    const transposed = transpose(this.gems);
    const pDiagonal = principalDiagonal(this.gems);
    const sDiagonal = secondaryDiagonal(this.gems);
    const combined = this.gems.concat(transposed).concat(pDiagonal).concat(sDiagonal);
    const duplicating = combined
      .map((row) =>
        this.toWindows(row, 3).filter((window) => new Set(window.map((gem) => gem.color)).size == 1)
      )
      .flat(Infinity);
    return [...new Set(duplicating)];
  }
  toWindows(inputArray, size) {
    return inputArray.reduce(
      (acc, _, index, arr) =>
        index + size > arr.length ? acc : acc.concat([arr.slice(index, index + size)]),
      []
    );
  }
  removeGem(gem) {
    console.log(findIndex2D(this.gems, gem));
    console.log(gem.boardIndexes);
    gem.text.text = "X";
    this.gems[gem.boardIndexes.x][gem.boardIndexes.y] = null;
    this.container.removeChild(gem);
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

  adjacent(gem1, gem2) {
    return gem1.boardIndexes.subtract(gem2.boardIndexes).magnitude() == 1;
  }

  swap(gem1, gem2) {
    this.swapped = !this.swapped;
    const i1 = gem1.boardIndexes.x;
    const j1 = gem1.boardIndexes.y;
    const i2 = gem2.boardIndexes.x;
    const j2 = gem2.boardIndexes.y;
    swapElements2D(this.gems, i1, j1, i2, j2);

    const gem1Coords = gem1.boardIndexes;
    gem1.boardIndexes = gem2.boardIndexes;
    gem2.boardIndexes = gem1Coords;
  }
}
