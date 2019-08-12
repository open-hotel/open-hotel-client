import { GameObject } from '../../engine/lib/GameObject'
import { Floor } from './Floor'
import { FloorBlock } from './FloorBlock'
import { Cube, CubeOptions } from '../../engine/lib/geometry/Cube'
import { FloorLadder } from './FloorLadder'
import { Texture, SCALE_MODES } from 'pixi.js'
import { Application } from '../../engine/Application'
import { Matrix } from '../../engine/lib/utils/Matrix'

// Defines if wall is facing X or Y axis
type RotationX = 4
type RotationY = 2
const RotationX = 4
const RotationY = 2
type Rotation = RotationX | RotationY

export class Wall extends GameObject {
    private $app: Application

    constructor(private block: FloorBlock | FloorLadder, private rotatedTo: Rotation = RotationX) {
        super()
        this.$app = Application.get()
        this.texture = this.generateTexture()
        this.setPosition()
    }

    public static fromFloor(floor: Floor): Matrix<Wall> {
        type Block = FloorBlock | FloorLadder

        return floor.$mapBlocks.map((block: Block, x, y) => {
            if (!block) {
                return
            }

            const neighbors = floor.getNeighborsOf(x, y)
            if (neighbors.every(block => !!block)) {
                return
            }

            const get = (x: number, y: number) => neighbors.get(x, y)

            if (get(1, 0) && get(0, 1)) {
                return
            }

            // If there're blocks in previous y and previous x at the same time, it should not have walls
            for (let row = y - 1; row > 0; row--) {
                for (let col = 0; col <= x - 1; col++) {
                    if (floor.$mapBlocks.get(col, row)) {
                        return
                    }
                }
            }

            if (get(2, 1) && !get(0, 1)) {
                return new Wall(block, RotationY)
            }

            return new Wall(block)
        })
    }

    public static WALL_HEIGHT = 128

    private static $cache: {
        toX?: Texture
        toY?: Texture
    } = {}

    private generateTexture(): PIXI.Texture {
        const { rotatedTo } = this
        const isToX = rotatedTo === 2

        const toKeyName = isToX ? 'toX' : 'toY'
        const Cache = Wall.$cache

        const cached = Cache[toKeyName]

        if (cached) {
            return cached
        }

        const cubeOptions: CubeOptions = {
            height: Wall.WALL_HEIGHT,
        }

        if (isToX) {
            cubeOptions.width = 32
            cubeOptions.depth = 3
        } else {
            cubeOptions.width = 3
            cubeOptions.depth = 32
        }

        const wall = new Cube(cubeOptions)
        return (Cache[toKeyName] = this.$app.renderer.generateTexture(wall, SCALE_MODES.NEAREST, 1))
    }

    private setPosition() {
        const position = this.block.isoPosition.clone()

        position.z = Wall.WALL_HEIGHT
        position.y -= 40
        position.x -= 19

        this.zIndex = this.block.zIndex + 1
        position.copyTo(this.isoPosition)
    }
}
