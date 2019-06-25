import { FloorBlock } from "./FloorBlock";
import { IsoPoint } from "../../engine/lib/IsoPoint";
import { Debug } from "../../engine/lib/utils/Debug";

type FloorMapElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type FloorMapRow<T> = T[]
type FloorMap<T> = FloorMapRow<T>[]

interface FloorOptions {
    map: FloorMap<FloorMapElevation> | string
}

export class Floor extends PIXI.Container {
    public $map: FloorMap<FloorMapElevation>;
    public $mapBlocks: FloorMap<FloorBlock>

    static parseMap (str:string) {
        return str.split(/\n/, 1024).reduce((rows, row) => {
            if(row.length > 0) {
                return rows.concat(row.split('').map(value => parseInt(value)))
            }
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
        const WIDTH = 32
        const HEIGHT = 32
        const DEPTH = 0
        const STEP_HEIGHT = 16

        this.$mapBlocks = []

        this.$map.forEach((row, x) => {
            const mapBlockRow:FloorBlock[] = []

            row.forEach((elevation, y) => {
                // if (elevation < 1 || elevation > 9) return;
                const block = new FloorBlock()

                block.iso = new IsoPoint(
                    350 + x * WIDTH,
                    y * HEIGHT,
                    0
                )

                mapBlockRow.push(block)
                this.addChild(block)
            })

            this.$mapBlocks.push(mapBlockRow)
        })
    }
}