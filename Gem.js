import * as PIXI from "pixi.js";
import { getRandomProp } from "./helpers";
import { OutlineFilter } from "@pixi/filter-outline";

export class Gem extends PIXI.Sprite {
  constructor(boardCoords, board) {
    const gemsTextures = PIXI.Assets.get("gems.json").textures;
    const texture = getRandomProp(gemsTextures);
    super(texture);

    this.boardCoords = boardCoords;
    this.board = board;
    this.color = texture.textureCacheIds[0].substring(
      0,
      texture.textureCacheIds[0].indexOf("Gem.")
    );
    this.vx = 0;
    this.vy = 0;
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
}
