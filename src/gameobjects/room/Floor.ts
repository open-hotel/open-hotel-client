import { FloorBlock } from "./FloorBlock";
import { FloorLadder } from "./FloorLadder";
import { IsoPoint } from "../../engine/lib/IsoPoint";
import ladders from "./ladders.json";
import { Matrix } from "../../engine/lib/utils/Matrix";
import { GameObject } from "../../engine/lib/GameObject";
import { Debug } from "../../engine/lib/utils/Debug";

export type Block = {
  x: number;
  y: number;
  z: number;
  ladder: number
}

type FloorMapElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface FloorOptions {
  map: Matrix<FloorMapElevation> | string;
}

const WIDTH = 32;
const HEIGHT = 32;
const STEP_HEIGHT = 32;

const createHasLadder = (map: Matrix<number>) => (test: Matrix<string>) => {
  const current = map.get(1, 1);
  return map.every((mapCol, rowIndex, colIndex) => {
    let blockTest:string|string[] = test.get(rowIndex, colIndex)

    if (blockTest === "*") return true
    if (blockTest === "?") return !mapCol
    
    blockTest = blockTest.split('|')
    
    return blockTest.some(t => {
      if (t === '?') return !mapCol
      const elevation = current + parseInt(t.replace(/[^\d\-]/g, ''))
      return mapCol === elevation
    })
  })
}

const wallColors = {
    top: 0x6f717a,
    front: 0x9597a3,
    left: 0xb6b8c7
}

function getLadder (blocks:Matrix<number>):number {
  const hasLadder = createHasLadder(blocks)
  const l = ladders.find((l) => hasLadder(Matrix.from(l.test)))

  return l && l.value
}

export class Floor extends GameObject {
  public $map: Matrix<FloorMapElevation>;
  public $mapBlocks: Matrix<FloorBlock|FloorLadder> = new Matrix();
  public $currentPathFinderTask: number

  static parseMap(str: string):Matrix<FloorMapElevation> {
    const rows = str.split(/\n/, 1024)
      .filter(f => f)
      .map((row) => row.split('').filter(c => c).map(parseInt)) as FloorMapElevation[][]
    return Matrix.from<FloorMapElevation>(rows)
  }

  constructor(options: FloorOptions) {
    super();

    options = Object.assign(
      {
        map: new Matrix<FloorMapElevation>()
      },
      options
    );

    this.$map =
      typeof options.map === "string"
        ? Floor.parseMap(options.map)
        : options.map;

    this.build();

    this.interactive = true
    this.sortableChildren = true
  }

  public static getPositionOf (floor: Floor, x:number, y:number): PIXI.IPoint {
    return floor.$mapBlocks.get(x,y, { position: new PIXI.Point }).position.clone()
  }

  public getPositionOf (x: number, y: number): PIXI.IPoint {
    return Floor.getPositionOf(this, x, y)
  }

  private build() {
    this.$map.forEachRow((currRow, rowIndex) => {
      const prevRow = this.$map.getRow(rowIndex - 1)
      const nextRow = this.$map.getRow(rowIndex + 1)

      currRow.forEach((col, colIndex) => {
        if (col < 1 || col > 9) return null;

        const blockArea = Matrix.from<FloorMapElevation>([
          [prevRow.get(colIndex - 1, 0), prevRow.get(colIndex, 0), prevRow.get(colIndex + 1, 0)],
          [currRow.get(colIndex - 1, 0), currRow.get(colIndex, 0), currRow.get(colIndex + 1, 0)],
          [nextRow.get(colIndex - 1, 0), nextRow.get(colIndex, 0), nextRow.get(colIndex + 1, 0)],
        ])

        const ladder = getLadder(blockArea)
        
        const position = new IsoPoint(
          rowIndex * WIDTH,
          colIndex * HEIGHT,
          col * STEP_HEIGHT
        );
        const block =
          typeof ladder === "number"
            ? new FloorLadder(position, ladder)
            : new FloorBlock(position);
        block.zIndex = colIndex + rowIndex + col

        block.set('map_position', { x: colIndex, y: rowIndex })

        this.addChild(block);
        
        this.$mapBlocks.set(colIndex, rowIndex, block)
      })
    })
  }
}
