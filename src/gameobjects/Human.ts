import { Cube } from "../engine/lib/geometry/Cube";
import { IsoPoint } from "../engine/lib/IsoPoint";
import { IPoint } from "pixi.js";
import { Tween } from "@tweenjs/tween.js";
import { GameObject } from "../engine/lib/GameObject";

const WALK_TIME = 300;

export class Human extends GameObject {
  constructor() {
    super();

    const body = new Cube({
      depth: 16,
      height: 16,
      width: 16,
      colors: {
        top: 0xcccccc,
        left: 0x888888,
        front: 0xaaaaaa
      }
    })

    this.addChild(body);

    const b = this.getBounds()
    const { width, height, depth, position } = body.$options

    const iso = new IsoPoint(
      (width / 2) - 32,
      (depth / 2),
      -height
    )

    iso.toPoint().copyTo(this.pivot);
  }
}
