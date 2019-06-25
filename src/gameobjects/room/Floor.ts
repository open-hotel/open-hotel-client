import { FloorBlock } from "./FloorBlock";
import { IsoPoint } from "../../engine/lib/IsoPoint";
import { Debug } from "../../engine/lib/utils/Debug";
import { Isometric } from "../../engine/lib/Isometric";

type FloorMapElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type FloorMapRow<T> = T[]
type FloorMap<T> = FloorMapRow<T>[]

interface FloorOptions {
    map: FloorMap<FloorMapElevation> | string
}

const WIDTH = 32
const HEIGHT = 32
const DEPTH = 0
const STEP_HEIGHT = 16

export class Floor extends PIXI.Sprite {
    public $map: FloorMap<FloorMapElevation>;
    public $mapBlocks: FloorMap<FloorBlock>

    static parseMap (str:string) {
        return str.split(/\n/, 1024).reduce((rows, row) => {
            if(row.length > 0) return rows.concat(row.split('').map(value => parseInt(value)))
            return rows
        }, [])
    }

    constructor (options:FloorOptions) {
        super()

        options = Object.assign({
            map: []
        }, options)

        this.$map = typeof options.map === 'string' ? Floor.parseMap(options.map) : options.map

        this.build()
    }

    private build () {
        this.$mapBlocks = []

        this.$map.forEach((row, x) => {
            const mapBlockRow:FloorBlock[] = []

            row.forEach((elevation, y) => {
                // if (elevation < 1 || elevation > 9) return;
                const block = new FloorBlock()

                Isometric.cartToIso( x * WIDTH, y * HEIGHT, STEP_HEIGHT * elevation)
                    .copyTo(block.position)

                mapBlockRow.push(block)
                this.addChild(block)
            })

            this.$mapBlocks.push(mapBlockRow)
        })
    }
}