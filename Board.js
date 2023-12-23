import { Gem } from "./Gem";
import { Container } from "pixi.js";
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
        const gem = new Gem(
          {
            x: i,
            y: j,
          },
          this
        );
        this.gems[i][j] = gem;
        gem.scale.set(0.5, 0.5);
        gem.position.set(i * 128, j * 128);
        this.container.addChild(gem);

        gem.text = new Text(i + ", " + j);
        gem.text.zIndex = 999;
        gem.text.x = gem.x;
        gem.text.y = gem.y;
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
    return (
      Math.abs(
        gem1.boardCoords.x +
          gem1.boardCoords.y -
          (gem2.boardCoords.x + gem2.boardCoords.y)
      ) == 1
    );
  }

  swap(targetGem) {
    swapElements2D(
      this.gems,
      this.selectedGem.boardCoords.x,
      this.selectedGem.boardCoords.y,
      targetGem.boardCoords.x,
      targetGem.boardCoords.y
    );

    const selectedX = this.selectedGem.boardCoords.x;
    const selectedY = this.selectedGem.boardCoords.y;

    this.selectedGem.boardCoords.x = targetGem.boardCoords.x;
    this.selectedGem.boardCoords.y = targetGem.boardCoords.y;

    targetGem.boardCoords.x = selectedX;
    targetGem.boardCoords.y = selectedY;
  }
}
