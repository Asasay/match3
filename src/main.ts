import { Application, Assets } from "pixi.js";
import Game from "./Game";

export const app = new Application<HTMLCanvasElement>({
  background: "0xffffff",
  resizeTo: window,
  antialias: true,
  resolution: 1,
});
document.body.appendChild(app.view);

Assets.load(["gems.json", "explosion.json"]).then(onAssetsLoaded);

function onAssetsLoaded() {
  const game = new Game(app);
  game.start();
}
