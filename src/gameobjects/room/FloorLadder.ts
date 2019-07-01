import { Application } from "../../engine/Application";
import { IsoPoint } from "../../engine/lib/IsoPoint";
import { Cube } from "../../engine/lib/geometry/Cube";
import { SCALE_MODES } from "pixi.js";
import { Debug } from "../../engine/lib/utils/Debug";

export class FloorLadder extends PIXI.Sprite {
  private $app: Application;
  public diagonal: boolean = false;

  constructor(
    public $position: IsoPoint = new IsoPoint(),
    public $direction = 2
  ) {
    super();

    this.$app = Application.get();
    this.texture = this.generateTexture();

    this.$position.toPoint().copyTo(this.position);
  }

  generateTexture() {
    const g = new PIXI.Graphics();
    const size = 8;
    const isoPivot = new IsoPoint(0, 0, 0)

    let border = new PIXI.Graphics()
    let borderPolygon = new PIXI.Polygon()

    if (this.$direction === 0) {
      isoPivot.add(-4, -4, 16)

      g.addChild(
        new Cube({
          depth: 8,
          height: size,
          width: 32,
          position: new IsoPoint(0, 0, 0)
        }),
        new Cube({
          depth: 8,
          height: size,
          width: 32,
          position: new IsoPoint(0, 8, 8)
        }),
        new Cube({
          depth: 8,
          height: size,
          width: 32,
          position: new IsoPoint(0, 16, 16)
        }),
        new Cube({
          depth: 8,
          height: size,
          width: 32,
          position: new IsoPoint(0, 24, 24)
        })
      );
    }
    else if (this.$direction === 1) {
      isoPivot.add(0, 0, 16)
      g.addChild(
        new Cube({
          depth: 32,
          height: size,
          width: 32,
          position: new IsoPoint(0, -32, -32)
        }),
        new Cube({
          depth: 24,
          height: size,
          width: 24,
          position: new IsoPoint(0, -24, -24)
        }),
        new Cube({
          depth: 16,
          height: size,
          width: 16,
          position: new IsoPoint(0, -16, -16)
        }),
        new Cube({
          depth: 8,
          height: size,
          width: 8,
          position: new IsoPoint(0, -8, -8)
        }),
      );
    }

    else if (this.$direction === 2) {
      borderPolygon = new PIXI.Polygon([
        new IsoPoint(-32, 22, 16).toPoint(),
        new IsoPoint(-24, 22, 16).toPoint(),
        new IsoPoint(-24, 22, 8).toPoint(),
        new IsoPoint(-16, 22, 8).toPoint(),
        new IsoPoint(-16, 22, 0).toPoint(),
        new IsoPoint(-8, 22, 0).toPoint(),
        new IsoPoint(-8, 22, -8).toPoint(),
        new IsoPoint(0, 22, -8).toPoint(),
      ])

      isoPivot.add(0, 0, 8)
      g.addChild(
        new Cube({
          depth: 32,
          height: size,
          width: 8,
          position: new IsoPoint(0, 0, 0)
        }),
        new Cube({
          depth: 32,
          height: size,
          width: 8,
          position: new IsoPoint(-8, 0, 8)
        }),
        new Cube({
          depth: 32,
          height: size,
          width: 8,
          position: new IsoPoint(-16, 0, 16)
        }),
        new Cube({
          depth: 32,
          height: size,
          width: 8,
          position: new IsoPoint(-24, 0, 24)
        })
      );
    }
    
    else if (this.$direction === 3) {
      borderPolygon = new PIXI.Polygon([
        new IsoPoint(0, 0, -8).toPoint(),
        new IsoPoint(0, 8, -8).toPoint(),
        new IsoPoint(0, 8, -16).toPoint(),
        new IsoPoint(0, 16, -16).toPoint(),
        new IsoPoint(0, 16, -24).toPoint(),
        new IsoPoint(0, 24, -24).toPoint(),
        new IsoPoint(0, 24, -32).toPoint(),
        new IsoPoint(0, 32, -32).toPoint(),
      ])
      g.addChild(
        new Cube({
          depth: 32,
          height: size,
          width: 32,
          position: new IsoPoint(0, 0, -32)
        }),
        new Cube({
          depth: 24,
          height: size,
          width: 24,
          position: new IsoPoint(0, 0, -24)
        }),
        new Cube({
          depth: 16,
          height: size,
          width: 16,
          position: new IsoPoint(0, 0, -16)
        }),
        new Cube({
          depth: 8,
          height: size,
          width: 8,
          position: new IsoPoint(0, 0, -8)
        }),
      );
    }
    
    else if (this.$direction === 4) {
      borderPolygon = new PIXI.Polygon([
        new IsoPoint(-8, 0, -8).toPoint(),
        new IsoPoint(8, 8, 8).toPoint(),
        new IsoPoint(8, 8, 16).toPoint(),
        new IsoPoint(8, 0, 16).toPoint(),
        new IsoPoint(8, 0, 24).toPoint(),
        new IsoPoint(8, -8, 24).toPoint(),
        new IsoPoint(8, -8, 32).toPoint(),
        new IsoPoint(8, -15, 32).toPoint(),
      ])

      isoPivot.add(0, 0, 8)

      g.addChild(
        new Cube({
          depth: 8,
          height: size,
          width: 32,
          position: new IsoPoint(0, 0, 0)
        }),
        new Cube({
          depth: 8,
          height: size,
          width: 32,
          position: new IsoPoint(0, -8, 8)
        }),
        new Cube({
          depth: 8,
          height: size,
          width: 32,
          position: new IsoPoint(0, -16, 16)
        }),
        new Cube({
          depth: 8,
          height: size,
          width: 32,
          position: new IsoPoint(0, -24, 24)
        })
      );
    }

    else if (this.$direction === 5) {
      isoPivot.add(0, 0, 16)
      
      g.addChild(
        new Cube({
          depth: 32,
          height: size,
          width: 8,
          position: new IsoPoint(-24, 0, 0)
        }),
        new Cube({
          depth: 32,
          height: size,
          width: 8,
          position: new IsoPoint(-16, 0, 8)
        }),
        new Cube({
          depth: 32,
          height: size,
          width: 8,
          position: new IsoPoint(-8, 0, 16)
        }),
        new Cube({
          depth: 32,
          height: size,
          width: 8,
          position: new IsoPoint(0, 0, 24)
        })
      );
    }

    borderPolygon.closeStroke = false

    border.lineStyle(2, 0x000000, .0809)
    // border.lineStyle(2, 0xFF0000, 1, 0)
    border.drawPolygon(borderPolygon)

    g.addChild(border)

    isoPivot.toPoint().copyTo(this.pivot);

    return this.$app.renderer.generateTexture(g, SCALE_MODES.NEAREST, 1);
  }
}
