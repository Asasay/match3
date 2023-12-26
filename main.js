import * as PIXI from "pixi.js";
import "@pixi/math-extras";
import Board from "./board";

export const app = new PIXI.Application({
  background: "0xffffff",
  resizeTo: window,
  antialias: true,
  resolution: 1,
});
document.body.appendChild(app.view);

const gridSize = 6;
const cellSize = Math.min(90, app.screen.width / gridSize);
let speed = 8;
let state, board;

PIXI.Assets.load(["gems.json", "explosion.json"]).then(onAssetsLoaded);

function onAssetsLoaded() {
  board = new Board(gridSize, gridSize, cellSize);
  app.stage.addChild(board.container);

  const stageMask = new PIXI.Graphics();
  stageMask.beginFill(0xff3300);
  stageMask.drawRect(
    app.screen.width / 2 - board.width / 2,
    app.screen.height / 2 - board.height / 2,
    board.width,
    board.height
  );
  stageMask.endFill();
  app.stage.mask = stageMask;

  app.stage.pivot = new PIXI.Point(app.stage.width / 2, app.stage.height / 2);
  app.stage.position = new PIXI.Point(app.screen.width / 2, app.screen.height / 2);
  state = idleState;
  app.ticker.add(gameLoop);
}

function gameLoop(delta) {
  state(delta);
}

let count = 0;
function idleState(delta) {
  count += 0.03;
  if (board.selectedGem)
    board.selectedGem.outlineFilter.thickness =
      (Math.abs(Math.sin((count * speed) / 10)) * cellSize) / 20;
  if (board.selectedGem && board.targetGem) state = moveState;
}

function moveState(delta) {
  const selectedGem = board.selectedGem;
  const targetGem = board.targetGem;
  if (
    !selectedGem.position.equals(selectedGem.boardIndexesToCoords) ||
    !targetGem.position.equals(targetGem.boardIndexesToCoords)
  ) {
    selectedGem.moveToNewPos(speed * delta);
    targetGem.moveToNewPos(speed * delta);
    return;
  } else if (board.swapped) state = comboState;
  else {
    state = idleState;
    board.selectedGem = null;
    board.targetGem = null;
  }
}

function comboState(delta) {
  const gemsForDeletion = board.clear();
  if (gemsForDeletion.length > 0) {
    gemsForDeletion.forEach((gem) => {
      gem.explode(app);
      board.removeGem(gem);
    });
    board.selectedGem = null;
    board.targetGem = null;
    board.rearrange();
    app.ticker.remove(gameLoop);
    setTimeout(() => app.ticker.add(gameLoop), 600);
    state = rearrangeState;
    return;
  } else if (board.selectedGem && board.targetGem) {
    board.swap(board.selectedGem, board.targetGem);
    state = moveState;
    return;
  } else {
    board.swapped = false;
    state = idleState;
  }
}

function rearrangeState(delta) {
  let gemsInPlace = true;
  board.gems.forEach((row) =>
    row.forEach((gem) => {
      if (gem === null) return null;
      if (!gem.position.equals(gem.boardIndexesToCoords)) {
        gemsInPlace = false;
        gem.moveToNewPos(speed * delta);
        return gem;
      }
    })
  );
  if (gemsInPlace) state = comboState;
}
