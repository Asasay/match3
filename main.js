import * as PIXI from "pixi.js";
import "@pixi/math-extras";
import Board from "./board";

//Create a Pixi Application
export const app = new PIXI.Application({
  background: "#1099bb",
  width: 128 * 5,
  height: 128 * 5,
  antialias: true,
  resolution: 1,
});
document.body.appendChild(app.view);

PIXI.Assets.load("gems.json").then(onAssetsLoaded);
let state, board;
function onAssetsLoaded() {
  board = new Board(5, 5);
  app.stage.addChild(board.container);
  state = play;
  app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

let count = 0;
function play(delta) {
  count += 0.03;
  board.gems.forEach((column, i) => {
    column.forEach((gem, j) => {
      const newPos = new PIXI.Point(i * 128, j * 128);
      if (!newPos.equals(gem.position)) {
        const delta = newPos.subtract(gem.position);
        const distance = delta.magnitude();
        if (distance < 6) {
          gem.position = newPos;
          gem.v.set(0, 0);
        } else {
          gem.v = delta.normalize();
        }
      }
      gem.position = gem.position.add(gem.v.multiplyScalar(5));
      gem.outlineFilter.thickness = Math.sin(count) * 5;
    });
  });
}
