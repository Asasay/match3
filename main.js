import * as PIXI from "pixi.js";
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
  //Update the current game state:
  state(delta);
}

let count = 0;
function play(delta) {
  count += 0.03;
  board.gems.forEach((row) => {
    row.forEach((gem) => {
      gem.x += gem.vx;
      gem.y += gem.vy;
      gem.outlineFilter.thickness = Math.sin(count) * 5;
    });
  });
}
