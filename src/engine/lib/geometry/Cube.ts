import { IsoPoint } from "../IsoPoint";

export type CubeFaceName = 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back' | string

export interface CubeOptions {
    width   ?: number,
    height  ?: number,
    depth   ?: number,
    position?: IsoPoint,
    faces   ?: CubeFaceName[]
}

export type CubeFaces = {
    [k in CubeFaceName]?: [IsoPoint, IsoPoint, IsoPoint, IsoPoint];
};

export class Cube extends PIXI.Graphics {
    public $options: CubeOptions;
    public $faces: CubeFaces
    public $textures: CubeFaces
    public $colors: {[k in CubeFaceName]: number} = {
        top: 0x989865,
        bottom: 0x989865,
        left: 0x838357,
        right: 0x838357,
        front: 0x6f6f49,
        back: 0x6f6f49,
    }
    public $opacity: {[k in CubeFaceName]: number} = {
        top: 1,
        bottom: 1,
        left: 1,
        right: 1,
        front: 1,
        back: 1,
    }

    constructor (options?: CubeOptions) {
        super()

        this.$options = {
            width: 50,
            height: 50,
            depth: 50,
            position: new IsoPoint(),
            faces: ['top', 'left', 'front'],
            ...(options || {})
        }

        const { position, width, height, depth } = this.$options

        this.$faces = {
            top: [
                new IsoPoint(position.x, position.y, position.z),
                new IsoPoint(position.x + width, position.y, position.z),
                new IsoPoint(position.x + width, position.y + depth, position.z),
                new IsoPoint(position.x, position.y + depth, position.z),
            ],
            bottom: [
                new IsoPoint(position.x, position.y, position.z - height),
                new IsoPoint(position.x + width, position.y, position.z - height),
                new IsoPoint(position.x + width, position.y + depth, position.z - height),
                new IsoPoint(position.x, position.y + depth, position.z - height),
            ],
        }

        this.$faces.back = [
            this.$faces.top[0],
            this.$faces.top[3],
            this.$faces.bottom[3],
            this.$faces.bottom[0],
        ]

        this.$faces.left = [
            this.$faces.top[2],
            this.$faces.top[3],
            this.$faces.bottom[3],
            this.$faces.bottom[2],
        ]

        this.$faces.right = [
            this.$faces.top[0],
            this.$faces.top[1],
            this.$faces.bottom[1],
            this.$faces.bottom[0],
        ]        
        
        this.$faces.front = [
            this.$faces.top[1],
            this.$faces.top[2],
            this.$faces.bottom[2],
            this.$faces.bottom[1],
        ]

        this.renderCube()
    }

    renderCube () {
        const { width, height, faces = [] } = this.$options

        for (let f of ['back', 'bottom', 'right', 'left', 'top', 'front'].filter(f => faces.includes(f))) {
            if (f in this.$faces) {
                this.beginFill(this.$colors[f], this.$opacity[f])
                this.drawPolygon(this.$faces[f].map(p => p.toPoint()))
                this.endFill()
            }
        }
    }
}