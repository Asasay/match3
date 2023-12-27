import { Container, Point, Application, ICanvas, DisplayObject } from "pixi.js";
import { Gem } from "./Gem";
import { moveNullsToLeft, notEmpty, swapElements2D, toWindows, transpose } from "./helpers";

export default class Board {
  app: Application<ICanvas>;
  gems: Array<Gem | null>[] = [];
  container: Container<DisplayObject> = new Container();
  width: number;
  height: number;
  selectedGem: Gem | null = null;
  targetGem: Gem | null = null;
  swapped: boolean = false;
  cellSize: number;

  constructor(rows: number, cols: number, cellSize: number, app: Application<ICanvas>) {
    this.app = app;
    this.width = cellSize * cols;
    this.height = cellSize * rows;
    this.cellSize = cellSize;

    for (var y = 0; y < rows; y++) {
      this.gems.push([]);
      for (var x = 0; x < cols; x++) {
        this.addGem(new Point(x, y), new Point(x * this.cellSize, y * this.cellSize));
      }
    }
  }

  clear() {
    const transposed = transpose(this.gems);
    // const pDiagonal = principalDiagonal(this.gems);
    // const sDiagonal = secondaryDiagonal(this.gems);
    const combined = this.gems.concat(transposed);
    // .concat(pDiagonal).concat(sDiagonal);
    const duplicating = combined
      .map((row) =>
        toWindows(row, 3).filter(
          (window) => new Set(window.map((gem) => gem && gem.color)).size == 1
        )
      )
      .flat(20)
      .filter(notEmpty);
    return [...new Set(duplicating)];
  }

  removeGem(gem: Gem) {
    this.gems[gem.boardIndexes.y][gem.boardIndexes.x] = null;
    this.container.removeChild(gem);
  }
  adjacent(gem1: Gem, gem2: Gem) {
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
  addGem(boardIndexes: Point, position: Point) {
    const newGem = new Gem(boardIndexes, this, this.cellSize, position);
    this.gems[boardIndexes.y][boardIndexes.x] = newGem;
    this.container.addChild(newGem);
    return newGem;
  }
  swap(gem1: Gem, gem2: Gem) {
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
