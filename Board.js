import { Container, Point, Sprite, Texture } from "pixi.js";
import { Gem } from "./Gem";
import { moveNullsToLeft, swapElements2D, toWindows, transpose } from "./helpers";

export default class Board {
  constructor(rows, cols, cellSize) {
    this.gems = [];
    this.container = new Container();
    this.width = cellSize * cols;
    this.height = cellSize * rows;
    this.selectedGem = null;
    this.targetGem = null;
    this.swapped = false;
    this.cellSize = cellSize;

    for (var y = 0; y < rows; y++) {
      this.gems.push([]);
      this.gems[y].push(new Array(rows));
      for (var x = 0; x < cols; x++) {
        const gem = this.addGem(new Point(x, y), new Point(x * this.cellSize, y * this.cellSize));
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

  clear() {
    const transposed = transpose(this.gems);
    // const pDiagonal = principalDiagonal(this.gems);
    // const sDiagonal = secondaryDiagonal(this.gems);
    const combined = this.gems.concat(transposed);
    // .concat(pDiagonal).concat(sDiagonal);
    const duplicating = combined
      .map((row) =>
        toWindows(row, 3).filter((window) => new Set(window.map((gem) => gem.color)).size == 1)
      )
      .flat(Infinity);
    return [...new Set(duplicating)];
  }
  removeGem(gem) {
    this.gems[gem.boardIndexes.y][gem.boardIndexes.x] = null;
    this.container.removeChild(gem);
  }
  adjacent(gem1, gem2) {
    return gem1.boardIndexes.subtract(gem2.boardIndexes).magnitude() == 1;
  }

  rearrange() {
    this.gems = transpose(transpose(this.gems).map((row) => moveNullsToLeft(row)));
    const nullCountInCol = Array(this.gems[0].length).fill(0);
    this.gems.forEach((row, y) =>
      row.forEach((gem, x) => {
        if (gem === null) nullCountInCol[x]++;
        else gem.boardIndexes.set(x, y);
      })
    );
    this.gems = this.gems.map((row, y) =>
      row.map((gem, x) => {
        if (gem === null) {
          return this.addGem(
            new Point(x, y),
            new Point(x * this.cellSize, y * this.cellSize - this.cellSize * nullCountInCol[x])
          );
        } else return gem;
      })
    );
  }
  addGem(boardIndexes, position) {
    const newGem = new Gem(boardIndexes, this);
    this.gems[boardIndexes.y][boardIndexes.x] = newGem;
    newGem.position = position;
    newGem.scale.set(this.cellSize / newGem.width, this.cellSize / newGem.height);
    this.container.addChild(newGem);
    newGem.eventMode = "static";
    newGem.cursor = "pointer";
    newGem.on("pointerdown", this.handleSelect(this));
    return newGem;
  }
  swap(gem1, gem2) {
    this.swapped = !this.swapped;
    const y1 = gem1.boardIndexes.y;
    const x1 = gem1.boardIndexes.x;
    const y2 = gem2.boardIndexes.y;
    const x2 = gem2.boardIndexes.x;
    swapElements2D(this.gems, y1, x1, y2, x2);

    const gem1Coords = gem1.boardIndexes;
    gem1.boardIndexes = gem2.boardIndexes;
    gem2.boardIndexes = gem1Coords;
  }
}
