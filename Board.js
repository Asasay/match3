import { app } from "./main";
import { Gem } from "./Gem";
import { Container } from "pixi.js";

export default class Board {
  constructor(rows, cols) {
    this.gems = [];
    this.container = new Container();
    for (var i = 0; i < rows; i++) {
      this.gems.push([]);
      this.gems[i].push(new Array(cols));
      for (var j = 0; j < cols; j++) {
        const gem = new Gem({
          x: i,
          y: j,
        });
        this.gems[i][j] = gem;
        gem.scale.set(0.5, 0.5);
        gem.position.set(i * 128, j * 128);
        this.container.addChild(gem);
      }
    }
  }
}
