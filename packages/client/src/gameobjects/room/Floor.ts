import * as PIXI from 'pixi.js'

import { FloorBlock } from './FloorBlock'
import { FloorLadder } from './FloorLadder'
import { Vector3 } from '../../engine/lib/isometric/Vector3'
import ladders from './ladders.json'
import { Matrix } from '@open-hotel/core'
import { GameObject } from '../../engine/lib/GameObject'
import { PathFinder } from '@open-hotel/core'
import { Wall } from './Wall'
import { createFloorTestFunction } from '../../engine/lib/utils/FloorUtils'
import { Furniture } from '../furniture/Furniture'

export interface Block {
  x: number
  y: number
  z: number
  ladder: number
}

export type FloorMapElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

interface FloorOptions {
  map: Matrix<FloorMapElevation> | string
  mobis?: Furniture[]
  tintBlocks?: boolean
}

const WIDTH = 32
const HEIGHT = 32
const STEP_HEIGHT = 32

// const wallColors = {
//     top: 0x6f717a,
//     front: 0x9597a3,
//     left: 0xb6b8c7,
// }

function getLadder(blocks: Matrix<number>): number {
  const hasLadder = createFloorTestFunction(blocks)
  const l = ladders.find(l => hasLadder(Matrix.from(l.test)))

  return l && l.value
}

export class Floor extends GameObject {
  public $map: Matrix<FloorMapElevation>
  public $mapBlocks: Matrix<FloorBlock | FloorLadder> = new Matrix()
  public pathFinder: PathFinder
  public furniture: Furniture[]
  public debugPathTint = false

  static parseMap(str: string): Matrix<FloorMapElevation> {
    const rows = str
      .split(/\n/, 1024)
      .filter(f => f)
      .map(row =>
        row
          .split('')
          .filter(c => c)
          .map(parseInt),
      ) as FloorMapElevation[][]
    return Matrix.from<FloorMapElevation>(rows)
  }

  constructor(options: FloorOptions) {
    super()

    this.furniture = options.mobis || []

    options = Object.assign(
      {
        map: new Matrix<FloorMapElevation>(),
      },
      options,
    )

    this.debugPathTint = options.tintBlocks

    this.$map = typeof options.map === 'string' ? Floor.parseMap(options.map) : options.map

    const grid = this.$map.$matrix

    this.pathFinder = new PathFinder(grid, (cell, curr) => {
      const a = grid[cell.y][cell.x]
      const b = grid[curr.y][curr.x]

      return a === b || Math.abs(a - b) === 1
    })

    this.build()
    this.placeFurniture()

    this.interactive = true
    this.sortableChildren = true

    const { x, y, width, height } = this.getBounds()

    this.pivot.set(width / 2 + x, height / 2 + y)
  }

  public static getPositionOf(floor: Floor, x: number, y: number): PIXI.IPoint {
    return floor.$mapBlocks.get(x, y, { position: new PIXI.Point() }).position.clone()
  }

  public getPositionOf(x: number, y: number): PIXI.IPoint {
    return Floor.getPositionOf(this, x, y)
  }

  public getFirstBlockIndexes(): number[] {
    const matrix = this.$map.$matrix
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x <= matrix[y].length; x++) {
        if (matrix[x][y]) {
          return [x, y]
        }
      }
    }
    return [0, 0]
  }

  public getNeighborsOf(x: number, y: number) {
    const prevRow = this.$map.getRow(y - 1)
    const nextRow = this.$map.getRow(y + 1)
    const currRow = this.$map.getRow(y)

    const nextCol = x + 1
    const prevCol = x - 1

    return Matrix.from<FloorMapElevation>([
      [prevRow.get(prevCol, 0), prevRow.get(x, 0), prevRow.get(nextCol, 0)],
      [currRow.get(prevCol, 0), currRow.get(x, 0), currRow.get(nextCol, 0)],
      [nextRow.get(prevCol, 0), nextRow.get(x, 0), nextRow.get(nextCol, 0)],
    ])
  }

  private placeFurniture() {
    this.sortableChildren = true
    for (const mobi of this.furniture) {
      const [x, y] = mobi.blockCoordinates[0]
      const block = this.$mapBlocks.get(x, y)
      mobi.zIndex = block.zIndex + 2
      this.addChild(mobi)
      mobi.position.copyFrom(block.position)
      mobi.position.y -= 45
      mobi.position.x += 10
    }
  }

  private build() {
    Wall.CURRENT_HEIGHT = Wall.WALL_HEIGHT + this.$map.reduce<number>((maxEl, el) => Math.max(maxEl, el), 1) * 32

    this.$map.forEachRow((currRow, rowIndex) => {
      const prevRow = this.$map.getRow(rowIndex - 1)
      const nextRow = this.$map.getRow(rowIndex + 1)

      currRow.forEach((col, colIndex) => {
        if (col < 1 || col > 9) {
          this.$mapBlocks.set(colIndex, rowIndex, null)
          return
        }

        const neighbors = Matrix.from<FloorMapElevation>([
          [prevRow.get(colIndex - 1, 0), prevRow.get(colIndex, 0), prevRow.get(colIndex + 1, 0)],
          [currRow.get(colIndex - 1, 0), currRow.get(colIndex, 0), currRow.get(colIndex + 1, 0)],
          [nextRow.get(colIndex - 1, 0), nextRow.get(colIndex, 0), nextRow.get(colIndex + 1, 0)],
        ])

        const ladder = getLadder(neighbors)

        const position = new Vector3(rowIndex * WIDTH, colIndex * HEIGHT, col * STEP_HEIGHT)
        const block = typeof ladder === 'number' ? new FloorLadder(position, ladder) : new FloorBlock(position)

        block.zIndex = colIndex + rowIndex + col

        block.mapPosition.set(colIndex, rowIndex, col)

        this.$mapBlocks.set(colIndex, rowIndex, block)

        this.addChild(block)
      })
    })

    const walls = Wall.fromFloor(this)
    walls.forEach(wall => wall && this.addChild(wall))
  }

  tintBlock(block: { x: number; y: number }, color = 0xff0000) {
    if (!this.debugPathTint) {
      return
    }
    const item = this.$mapBlocks.get(block.x, block.y)
    item.tint = color
  }
  tintBlocks(blocks: { x: number; y: number }[], color = 0xff0000) {
    if (!this.debugPathTint) {
      return
    }
    for (let p of blocks) {
      this.tintBlock(p, color)
    }
  }
}
