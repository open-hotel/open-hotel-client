import { FloorBlock } from "./FloorBlock";
import { Isometric } from "../../engine/lib/Isometric";
import { FloorLadder } from "./FloorLadder";
import { IsoPoint } from "../../engine/lib/IsoPoint";

type FloorMapElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type FloorMapRow<T> = T[]
type FloorMap<T> = FloorMapRow<T>[]

interface FloorOptions {
    map: FloorMap<FloorMapElevation> | string
}

const WIDTH = 32
const HEIGHT = 32
const DEPTH = 0
const STEP_HEIGHT = 32

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
    public getMapBlocks () {
        const blocks: { x: number, y:number, z: number, ladder: number }[] = []

        function createLadderDetector (col: number, x:number, y: number) {
            return (prevCol: number|null, ladderDirection: number|null) => {
                if (typeof prevCol === 'number' && prevCol !== 0 && prevCol - 1 === col) {
                    return blocks.push({
                        x, y,
                        z: col + 1,
                        ladder: ladderDirection
                    })
                }

                return false
            }
        }

        this.$map.forEach ((row, rowIndex) => {
            const prevRow = rowIndex > 0 ? this.$map[rowIndex - 1] : null
            const nextRow = rowIndex < this.$map.length - 1 ? this.$map[rowIndex + 1] : null

            row.forEach((col, colIndex) => {
                const prevCol = rowIndex > 0 ? row[colIndex - 1] : null
                const nextCol = rowIndex < row.length - 1 ? row[colIndex + 1] : null
                const prevRowCol = prevRow ? prevRow[colIndex] : null
                const nextRowCol = nextRow ? nextRow[colIndex] : null
                
                const prevRowNextCol = prevRow && colIndex < prevRow.length - 1 ? prevRow[colIndex+1] : null
                const prevRowPrevCol = prevRow && colIndex > 0 ? prevRow[colIndex-1] : null

                const nextRowNextCol = nextRow && colIndex < nextRow.length - 1 ? nextRow[colIndex+1] : null
                const nextRowPrevCol = nextRow && colIndex > 0 ? nextRow[colIndex-1] : null
                const ladderDetector = createLadderDetector(col, rowIndex, colIndex)

                if (col === 0) {
                    return blocks.push({
                        x: rowIndex,
                        y: colIndex,
                        z: 0,
                        ladder: null
                    })
                }

                if (ladderDetector(prevCol, 4)) return null
                if (ladderDetector(prevRowCol, 2)) return null
                if (ladderDetector(nextCol, 0)) return null
                // if (ladderDetector(prevRowNextCol, 1)) return null
                // if (ladderDetector(prevRowPrevCol, 3)) return null
                if (ladderDetector(nextRowCol, 5)) return null

                blocks.push({
                    x: rowIndex,
                    y: colIndex,
                    z: col,
                    ladder: null
                })
            })
        })

        return blocks
    }

    private build () {
        this.getMapBlocks().forEach(b => {
            if (b.z < 1 || b.z > 9) return;
            const position = new IsoPoint(b.x * WIDTH, b.y * HEIGHT, STEP_HEIGHT * b.z)
            const block = typeof b.ladder === 'number'
                ? new FloorLadder(position, b.ladder)
                : new FloorBlock(position)

            this.addChild(block)
        })
    }
}