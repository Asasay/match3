import * as PIXI from "pixi.js";
import "@pixi/math-extras";
import Board from "./board";

//Create a Pixi Application
export const cellSize = 128;
export const app = new PIXI.Application({
  background: "#1099bb",
  width: cellSize * 5,
  height: cellSize * 5,
  antialias: true,
  resolution: 1,
});
document.body.appendChild(app.view);

PIXI.Assets.load("gems.json").then(onAssetsLoaded);
let state, board;
function onAssetsLoaded() {
  board = new Board(5, 5);
  app.stage.addChild(board.container);
  state = idleState;
  app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

let count = 0;
function idleState(delta) {
  count += 0.03;
  if (board.selectedGem) board.selectedGem.outlineFilter.thickness = Math.sin(count) * 5;
  if (board.selectedGem && board.targetGem) state = moveState;
}

function moveState(delta) {
  if (
    !board.selectedGem.position.equals(board.selectedGem.boardCoords.multiplyScalar(cellSize)) ||
    !board.targetGem.position.equals(board.targetGem.boardCoords.multiplyScalar(cellSize))
  ) {
    board.selectedGem.moveToNewPos(5);
    board.targetGem.moveToNewPos(5);
  } else {
    board.selectedGem = null;
    board.targetGem = null;
    state = idleState;
  }
}
