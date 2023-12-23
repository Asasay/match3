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
  state(delta);
}

let count = 0;
function play(delta) {
  count += 0.03;
  board.gems.forEach((column, i) => {
    column.forEach((gem, j) => {
      const newX = i * 128;
      const newY = j * 128;
      if (gem.x != newX || gem.y != newY) {
        const deltaX = gem.x - newX;
        const deltaY = gem.y - newY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < 6) {
          gem.x = newX;
          gem.vx = 0;
          gem.y = newY;
          gem.vy = 0;
        } else {
          gem.vx = -deltaX / distance;
          gem.vy = -deltaY / distance;
        }
      }
      gem.x += gem.vx * 5;
      gem.y += gem.vy * 5;
      gem.outlineFilter.thickness = Math.sin(count) * 5;
    });
  });
}
