import { Application } from '../../engine/Application'
import { IsoPoint } from '../../engine/lib/IsoPoint'
import { Cube } from '../../engine/lib/geometry/Cube'
import { SCALE_MODES, Polygon } from 'pixi.js'
// import { Debug } from "../../engine/lib/utils/Debug";
import { GameObject } from '../../engine/lib/GameObject'

function createSteps(cb: Function) {
    return new Array(4).fill(null).map((_, index) => {
        const { height = 8, depth = 8, width = 8, position = new IsoPoint() } = cb(index)
        return new Cube({ depth, height, width, position })
    })
}

export class FloorLadder extends GameObject {
    private $app: Application
    public diagonal: boolean = false

    static textureCache: {
        [key: number]: {
            hitArea: Polygon
            texture: PIXI.Texture
        }
    } = {}

    constructor(public $position: IsoPoint = new IsoPoint(), public $direction = 2) {
        super()

        this.$app = Application.get()

        const { texture, hitArea } = FloorLadder.generateTexture(this.$direction)

        this.texture = texture
        this.hitArea = hitArea

        this.interactive = true
        this.$position.toPoint().copyTo(this.position)
        this.pivot.set(0, 32)
    }

    static generateTexture(direction: number) {
        if (direction in FloorLadder.textureCache) {
            return FloorLadder.textureCache[direction]
        }

        const g = new PIXI.Graphics()

        let border = new PIXI.Graphics()
        let borderPolygon = new PIXI.Polygon()
        let hitArea = new Polygon([
            new IsoPoint(32, 0).toPoint(),
            new IsoPoint(64, 0).toPoint(),
            new IsoPoint(64, 32).toPoint(),
            new IsoPoint(31, 32).toPoint(),
        ])

        if (direction === 0) {
            g.addChild(
                ...createSteps((i: number) => ({
                    width: 32,
                    position: new IsoPoint(0, (i / 4) * 32, 8 * i - 32),
                })),
            )

            hitArea = new Polygon([
                new IsoPoint(32, 16).toPoint(),
                new IsoPoint(78, 16).toPoint(),
                new IsoPoint(78, 32).toPoint(),
                new IsoPoint(31, 32).toPoint(),
            ])
        } else if (direction === 1) {
            g.addChild(
                ...createSteps((i: number) => {
                    const size = 32 - (i / 4) * 32
                    return {
                        width: size,
                        depth: size,
                        position: new IsoPoint(0, 32 - size, 8 * i - 24),
                    }
                }),
            )

            hitArea = new Polygon([
                new IsoPoint(16, 8, 0).toPoint(),
                new IsoPoint(64, 0, -16).toPoint(),
                new IsoPoint(64, 32, -16).toPoint(),
                new IsoPoint(31, 32, 16).toPoint(),
            ])
        } else if (direction === 2) {
            g.addChild(
                ...createSteps((i: number) => ({
                    depth: 32,
                    position: new IsoPoint((i / -4) * 32, 0, 8 * i),
                })),
            )

            hitArea = new Polygon([
                new IsoPoint(32, 0, 16).toPoint(),
                new IsoPoint(64, 0, -16).toPoint(),
                new IsoPoint(64, 32, -16).toPoint(),
                new IsoPoint(31, 32, 16).toPoint(),
            ])
        } else if (direction === 3) {
            g.addChild(
                ...createSteps((i: number) => {
                    const size = 32 - (i / 4) * 32
                    return {
                        width: size,
                        depth: size,
                        position: new IsoPoint(0, 0, 8 * i),
                    }
                }),
            )

            hitArea = new Polygon([
                new IsoPoint(32, 0, 16).toPoint(),
                new IsoPoint(64, 0, -16).toPoint(),
                new IsoPoint(64, 32, -16).toPoint(),
                new IsoPoint(31, 32, -16).toPoint(),
            ])
        } else if (direction === 4) {
            g.addChild(
                ...createSteps((i: number) => ({
                    width: 32,
                    position: new IsoPoint(0, (i / -4) * 32, 8 * i),
                })),
            )
            hitArea = new Polygon([
                new IsoPoint(32, 0, 16).toPoint(),
                new IsoPoint(64, 0, 16).toPoint(),
                new IsoPoint(64, 32, -16).toPoint(),
                new IsoPoint(32, 32, -16).toPoint(),
            ])
        } else if (direction === 5) {
            g.addChild(
                ...createSteps((i: number) => {
                    const size = 32 - (i / 4) * 32
                    return {
                        width: size,
                        depth: size,
                        position: new IsoPoint(32 - size, 0, 8 * i - 24),
                    }
                }),
            )

            hitArea = new Polygon([
                new IsoPoint(54, 0, 16).toPoint(),
                new IsoPoint(64, 0, 16).toPoint(),
                new IsoPoint(64, 32, -16).toPoint(),
                new IsoPoint(32, 32, -16).toPoint(),
            ])
        } else if (direction === 6) {
            g.addChild(
                ...createSteps((i: number) => ({
                    depth: 32,
                    position: new IsoPoint((i / 4) * 32, 16, 8 * i - 16),
                })),
            )

            hitArea = new Polygon([
                new IsoPoint(40, -16).toPoint(),
                new IsoPoint(56, -16).toPoint(),
                new IsoPoint(56, 48).toPoint(),
                new IsoPoint(40, 48).toPoint(),
            ])
        } else if (direction === 7) {
            g.addChild(
                ...createSteps((i: number) => {
                    const size = 32 - (i / 4) * 32
                    return {
                        width: size,
                        depth: size,
                        position: new IsoPoint(64 - size, 64 - size, 8 * i),
                    }
                }),
            )

            hitArea = new Polygon([])
        }

        borderPolygon.closeStroke = false

        border.lineStyle(2, 0x000000, 0.05)
        // border.lineStyle(2, 0xFF0000, 1, 0)
        border.drawPolygon(borderPolygon)

        g.addChild(border)

        const texture = Application.get().renderer.generateTexture(g, SCALE_MODES.NEAREST, 1)
        return (FloorLadder.textureCache[direction] = {
            texture,
            hitArea,
        })
    }
}
