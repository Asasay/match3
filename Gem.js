import * as PIXI from "pixi.js";
import { getRandomProp } from "./helpers";
import { OutlineFilter } from "@pixi/filter-outline";

export class Gem extends PIXI.Sprite {
  constructor(boardIndexes, board, size, position) {
    const gemsTextures = PIXI.Assets.get("gems.json").textures;
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

    this.outlineFilter = new OutlineFilter(this.size / 20, "#DE6F3E", 1, 0.8);
    this.outlineFilter.enabled = false;
    this.filters = [this.outlineFilter];
    this.counter = 0;

    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", this.#handleSelect, this);
  }

  #handleSelect() {
    const targetGem = this;
    if (this.board.selectedGem) {
      this.board.selectedGem.deselect();
      if (this.board.adjacent(this.board.selectedGem, targetGem)) {
        this.board.targetGem = targetGem;
        this.board.swap(this.board.selectedGem, this.board.targetGem);
      } else {
        this.board.selectedGem = null;
      }
    } else {
      targetGem.select();
      this.board.selectedGem = targetGem;
    }
  }
  #selectAnimation(delta) {
    this.counter += 0.03;
    this.outlineFilter.thickness = (Math.abs(Math.sin(this.counter)) * this.size) / 20;
  }

  select() {
    this.selected = true;
    this.counter = 0;
    this.board.app.ticker.add(this.#selectAnimation, this);
    this.outlineFilter.enabled = true;
  }
  deselect() {
    this.selected = false;
    this.board.app.ticker.remove(this.#selectAnimation, this);
    this.outlineFilter.enabled = false;
  }
  moveToNewPos(speed) {
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
    const explosionTextures = Object.values(PIXI.Assets.get("explosion.json").textures);
    const explosion = new PIXI.AnimatedSprite(explosionTextures);
    explosion.position = this.position;
    explosion.scale.set(this.size / explosion.width, this.size / explosion.height);
    explosion.onLoop = () => explosion.destroy();
    this.board.app.stage.addChild(explosion);
    explosion.play();
  }
}
