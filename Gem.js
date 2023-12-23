import * as PIXI from "pixi.js";
import { getRandomProp } from "./helpers";
import { OutlineFilter } from "@pixi/filter-outline";
import { cellSize } from "./main";

export class Gem extends PIXI.Sprite {
  constructor(boardCoords, board) {
    const gemsTextures = PIXI.Assets.get("gems.json").textures;
    const texture = getRandomProp(gemsTextures);
    super(texture);

    this.boardCoords = boardCoords;
    this.board = board;
    this.color = texture.textureCacheIds[0].substring(0, texture.textureCacheIds[0].indexOf("Gem."));
    this.v = new PIXI.Point(0, 0);
    this.selected = false;

    this.outlineFilter = new OutlineFilter(6, "#DE6F3E", 1, 0.8);
    this.outlineFilter.enabled = false;
    this.filters = [this.outlineFilter];
  }

  select() {
    this.selected = true;
    this.outlineFilter.enabled = true;
  }
  deselect() {
    this.selected = false;
    this.outlineFilter.enabled = false;
  }
  moveToNewPos(speed) {
    const newPos = this.boardCoords.multiplyScalar(cellSize);
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
}
