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

let speed = 5;
let count = 0;
function idleState(delta) {
  console.log("idleState");
  count += 0.03;
  if (board.selectedGem) board.selectedGem.outlineFilter.thickness = Math.sin(count) * speed;
  if (board.selectedGem && board.targetGem) state = moveState;
}

function moveState(delta) {
  console.log("moveState");
  const selectedGem = board.selectedGem;
  const targetGem = board.targetGem;
  if (
    !selectedGem.position.equals(selectedGem.boardIndexesToCoords) ||
    !targetGem.position.equals(targetGem.boardIndexesToCoords)
  ) {
    selectedGem.moveToNewPos(speed);
    targetGem.moveToNewPos(speed);
    return;
  } else if (board.swapped) state = comboState;
  else {
    state = idleState;
    board.selectedGem = null;
    board.targetGem = null;
  }
}

function comboState(delta) {
  console.log("comboState");
  const gemsForDeletion = board.clear();
  if (gemsForDeletion.length > 0) {
    gemsForDeletion.forEach((gem) => board.removeGem(gem));
    board.selectedGem = null;
    board.targetGem = null;
    board.rearrange();
    state = rearrangeState;
    return;
  } else {
    board.swap(board.selectedGem, board.targetGem);
    state = moveState;
    return;
  }
  // state = idleState;
  // board.selectedGem = null;
  // board.targetGem = null;
}

function rearrangeState(delta) {
  console.log("rearrangeState");
  let gemsInPlace = true;
  board.gems.forEach((row) =>
    row.forEach((gem) => {
      if (gem === null) return null;
      if (!gem.position.equals(gem.boardIndexesToCoords)) {
        gemsInPlace = false;
        gem.moveToNewPos(speed / 3);
        return gem;
      }
    })
  );
  if (gemsInPlace) state = idleState;
}
