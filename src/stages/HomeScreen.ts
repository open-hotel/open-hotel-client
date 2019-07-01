import { Scene } from "../engine/lib/Scene";
import { Floor } from "../gameobjects/room/Floor";
import { FloorBlock } from "../gameobjects/room/FloorBlock";
import { IsoPoint } from "../engine/lib/IsoPoint";
import { Viewport } from "pixi-viewport";
import { Debug } from "../engine/lib/utils/Debug";
import { Cube } from "../engine/lib/geometry/Cube";
import { FloorLadder } from "../gameobjects/room/FloorLadder";

const MAX_ZOOM = 4;
const MIN_ZOOM = 1 / 4;

export class HomeScreen extends Scene {
  protected $camera: Viewport;

  setup() {
    this.$camera = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: window.innerWidth * 2,
      worldHeight: window.innerHeight * 2,
      interaction: this.$app.renderer.plugins.interaction
    })
      .drag({
        reverse: false
      })
      .pinch()
      .wheel()
      .clampZoom({
        maxHeight: window.innerHeight * MAX_ZOOM,
        maxWidth: window.innerWidth * MAX_ZOOM,
        minHeight: window.innerHeight * MIN_ZOOM,
        minWidth: window.innerWidth * MIN_ZOOM
      });

    const bg = new PIXI.Graphics();

    bg.beginFill(0x000000, 1);
    bg.drawRect(0, 0, this.$app.view.width, this.$app.view.height);
    bg.endFill();

    bg.width = this.$app.view.width;
    bg.height = this.$app.view.height;

    this.addChild(bg, this.$camera);
  }

  ready() {
    // const floor = new Floor({
    //     map: [
    //         [1,1,1,1],
    //         [1,0,1,1],
    //         [1,1,2.5,1],
    //         [1,1,2,1],
    //     ]
    // })

    // floor.position.set(this.width / 2, this.height / 2)
    // floor.pivot.set(floor.width / 2, floor.height / 2)

    // this.$camera.addChild(
    //   new FloorBlock(new IsoPoint(-64, -64, 0)),
    //   new FloorBlock(new IsoPoint(-64, -32, 0)),
    //   new FloorBlock(new IsoPoint(-64, 0, 0)),
    //   new FloorBlock(new IsoPoint(-64, 32, 0)),
    //   new FloorBlock(new IsoPoint(-64, 64, 0)),

    //   new FloorBlock(new IsoPoint(-32, 64, 0)),
    //   new FloorBlock(new IsoPoint(0, 64, 0)),
    //   new FloorBlock(new IsoPoint(32, 64, 0)),

    //   new FloorBlock(new IsoPoint(-32, -64, 0)),
    //   new FloorBlock(new IsoPoint(0, -64, 0)),
    //   new FloorBlock(new IsoPoint(32, -64, 0)),

    //   new FloorBlock(new IsoPoint(64, -64, 0)),
    //   new FloorBlock(new IsoPoint(64, -32, 0)),
    //   new FloorBlock(new IsoPoint(64, 0, 0)),
    //   new FloorBlock(new IsoPoint(64, 32, 0)),
    //   new FloorBlock(new IsoPoint(64, 64, 0)),

    //   new FloorLadder(new IsoPoint(0, -32, 32), 0),
    //   new FloorLadder(new IsoPoint(32, -32, 32), 1),
    //   new FloorLadder(new IsoPoint(32, 0, 32), 2),
    //   new FloorLadder(new IsoPoint(0, 32, 32), 4),
    //   new FloorLadder(new IsoPoint(32, 32, 32), 3),
    //   new FloorBlock(new IsoPoint(0, 0, 32))
    // );

    this.$camera.addChild(new Floor({
      map: [
        [3,3,3,3,3,2,2,2,2,2,2],
        [3,3,3,3,3,2,2,2,2,2,2],
        [3,3,3,3,3,2,2,2,2,2,2],
        [3,3,3,3,3,2,2,2,2,2,2],
        [3,3,3,3,3,2,2,2,2,2,2],
        [2,2,2,2,2,2,2,2,2,2,2],
        [2,2,2,2,2,2,2,2,2,2,2],
        [2,2,2,2,2,2,2,2,2,2,2],
        [2,2,2,2,2,2,2,2,2,2,2],
        [2,2,2,2,2,2,2,2,2,2,2],
        [2,2,2,2,2,2,2,2,2,2,2],
      ]
    }))
  }
}
