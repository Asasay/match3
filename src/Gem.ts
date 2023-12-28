import * as PIXI from "pixi.js";
import { getRandomProp } from "./helpers";
import { OutlineFilter } from "@pixi/filter-outline";
import Board from "./Board";

export class Gem extends PIXI.Sprite {
  boardIndexes: PIXI.Point;
  board: Board;
  size: number;
  color: string;
  v: PIXI.Point;
  selected: boolean;
  outlineFilter: OutlineFilter;
  counter: number;
  constructor(boardIndexes: PIXI.Point, board: Board, size: number, position: PIXI.Point) {
    const gemsTextures: PIXI.Texture[] = PIXI.Assets.get("gems.json").textures;
    const texture = getRandomProp(gemsTextures);
    super(texture);

    this.boardIndexes = boardIndexes;
    this.board = board;
    this.size = size;
    this.position = position || new PIXI.Point(0, 0);
    this.scale.set(this.size / this.width, this.size / this.height);
    this.color = texture.textureCacheIds[0].substring(
      0,
      texture.textureCacheIds[0].indexOf("Gem.")
    );
    this.v = new PIXI.Point(0, 0);
    this.selected = false;

    this.outlineFilter = new OutlineFilter(this.size / 20, 0xde6f3e, 1, 0.8);
    this.outlineFilter.enabled = false;
    this.filters = [this.outlineFilter];
    this.counter = 0;

    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", this.select, this);
  }

  // @ts-ignore
  #selectAnimation(delta: number) {
    this.counter += 0.03;
    this.outlineFilter.thickness = (Math.abs(Math.sin(this.counter)) * this.size) / 20;
  }

  select() {
    if (!this.board.interactive) return;
    if (!this.board.selectedGem && !this.board.targetGem) {
      this.board.selectedGem = this;
      this.counter = 0;
      this.board.app.ticker.add(this.#selectAnimation, this);
      this.outlineFilter.enabled = true;
    } else if (this.board.selectedGem && !this.board.targetGem) {
      this.board.selectedGem?.deselect();
      this.board.targetGem = this;
      if (this.board.adjacent(this.board.selectedGem, this.board.targetGem)) {
        this.board.swap(this.board.selectedGem, this.board.targetGem);
      }
    }
  }

  deselect() {
    this.board.app.ticker.remove(this.#selectAnimation, this);
    this.outlineFilter.enabled = false;
  }
  moveToNewPos(speed: number) {
    const newPos = this.boardIndexesToCoords;
    const delta = newPos.subtract(this.position);
    const distance = delta.magnitude();
    if (distance <= speed) {
      this.position = newPos;
      this.v.set(0, 0);
    } else {
      this.v = delta.normalize();
    }

    this.position = this.position.add(this.v.multiplyScalar(speed));
  }
  get boardIndexesToCoords() {
    return this.boardIndexes.multiplyScalar(this.size);
  }
  explode() {
    const explosionTextures: PIXI.Texture[] = Object.values(
      PIXI.Assets.get("explosion.json").textures
    );
    const explosion = new PIXI.AnimatedSprite(explosionTextures);
    explosion.position = this.position;
    explosion.scale.set(this.size / explosion.width, this.size / explosion.height);
    explosion.onLoop = () => explosion.destroy();
    this.board.app.stage.addChild(explosion);
    explosion.play();
  }
}
