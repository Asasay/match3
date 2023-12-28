import * as PIXI from "pixi.js";
import "@pixi/math-extras";
import Board from "./Board";

export const app = new PIXI.Application<HTMLCanvasElement>({
  background: "0xffffff",
  resizeTo: window,
  antialias: true,
  resolution: 1,
});
document.body.appendChild(app.view);

const gridSize = 6;
const cellSize = Math.min(90, app.screen.width / gridSize);
let speed = 9;
let state: (delta: number) => void, board: Board;

PIXI.Assets.load(["gems.json", "explosion.json"]).then(onAssetsLoaded);

function onAssetsLoaded() {
  board = new Board(gridSize, gridSize, cellSize, app);
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

function gameLoop(delta: number) {
  state(delta);
}
// @ts-ignore
function idleState(delta: number) {
  if (board.selectedGem && board.targetGem) {
    board.interactive = false;
    state = moveState;
  }
}

function moveState(delta: number) {
  const selectedGem = board.selectedGem;
  const targetGem = board.targetGem;
  if (
    !selectedGem?.position.equals(selectedGem.boardIndexesToCoords) ||
    !targetGem?.position.equals(targetGem.boardIndexesToCoords)
  ) {
    selectedGem?.moveToNewPos(speed * delta);
    targetGem?.moveToNewPos(speed * delta);
    return;
  } else if (board.swapped) state = comboState;
  else {
    state = idleState;
    board.interactive = true;
    board.selectedGem = null;
    board.targetGem = null;
  }
}
// @ts-ignore
function comboState(delta: number) {
  const gemsForDeletion = board.clear();
  if (gemsForDeletion.length > 0) {
    board.selectedGem = null;
    board.targetGem = null;
    gemsForDeletion.forEach((gem) => {
      gem.explode();
      board.removeGem(gem);
    });
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
    board.interactive = true;
    board.swapped = false;
    state = idleState;
  }
}

function rearrangeState(delta: number) {
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
