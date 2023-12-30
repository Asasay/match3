import "@pixi/math-extras";
import { Application, Graphics, Point } from "pixi.js";
import Board from "./Board";
import { IdleState, State } from "./States";

class Game {
  state: State;
  app: Application<HTMLCanvasElement>;
  board: Board;
  speed: number;

  constructor(app: Application<HTMLCanvasElement>, cols = 6, rows = 6, speed = 8) {
    this.app = app;
    this.speed = speed;
    const cellSize = Math.min(90, app.screen.width / cols);
    this.board = new Board(rows, cols, cellSize, app);
    app.stage.addChild(this.board.container);
    const stageMask = new Graphics();
    stageMask.beginFill(0xff3300);
    stageMask.drawRect(
      app.screen.width / 2 - this.board.width / 2,
      app.screen.height / 2 - this.board.height / 2,
      this.board.width,
      this.board.height
    );
    stageMask.endFill();
    app.stage.mask = stageMask;

    app.stage.pivot = new Point(app.stage.width / 2, app.stage.height / 2);
    app.stage.position = new Point(app.screen.width / 2, app.screen.height / 2);
    this.state = new IdleState(this);
  }

  changeState(state: State) {
    this.state = state;
  }

  gameLoop(delta: number) {
    this.state.loop(delta);
  }

  start() {
    this.app.ticker.add(this.gameLoop, this);
  }

  stop(time?: number) {
    this.app.ticker.remove(this.gameLoop, this);
    time && setTimeout(this.start.bind(this), time);
  }
}

export default Game;
