import { Gem } from "./Gem";
import { Container, Point } from "pixi.js";
import {
  principalDiagonal,
  moveNullsToLeft,
  secondaryDiagonal,
  swapElements2D,
  toWindows,
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
    for (var y = 0; y < rows; y++) {
      this.gems.push([]);
      this.gems[y].push(new Array(rows));
      for (var x = 0; x < cols; x++) {
        const gem = new Gem(new Point(x, y), this);
        this.gems[y][x] = gem;
        gem.scale.set(cellSize / gem.width, cellSize / gem.height);
        gem.position.set(x * cellSize, y * cellSize);
        this.container.addChild(gem);

        gem.text = new Text(y + ", " + x);
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

  clear() {
    const transposed = transpose(this.gems);
    const pDiagonal = principalDiagonal(this.gems);
    const sDiagonal = secondaryDiagonal(this.gems);
    const combined = this.gems.concat(transposed).concat(pDiagonal).concat(sDiagonal);
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
    this.gems.forEach((row, y) =>
      row.forEach((gem, x) => {
        if (gem === null) return;
        else gem.boardIndexes.set(x, y);
      })
    );
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
