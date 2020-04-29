// import * as PIXI from 'pixi.js-legacy'

// import Room from './Room'
// import { Matrix } from '../../engine/lib/util/Matrix'
// import { createFloorTestFunction } from '../../engine/lib/util/FloorUtils'
// import { Game } from '../Game'
// import ladders from './floor/ladders'
// import { Texture } from 'pixi.js-legacy'
// import { StairDirection } from '../imager/room.imager'
// import { IsoPoint } from '../../engine/lib/IsoPoint'
// import { Floor } from './floor/Floor'
// import { FloorSelection } from './floor/FloorSelection'
// import { MessageRequestUserMovement } from '../network/outgoing/MessageRequestUserMovement'
// import { Wall } from './wall/Wall'
// import { Debug } from '../../engine/lib/util/Debug'
// import { Provider } from 'injets'

// function getStairType(blocks: Matrix<number>): number {
//   const hasLadder = createFloorTestFunction(blocks)
//   const l = ladders.find(l => hasLadder(l.test))
//   return l && l.value
// }

// @Provider()
// export class RoomEngine {
//   public floorSprites: Matrix<Floor>
//   public wallSprites: Matrix<Wall> = new Matrix()
//   public container = new PIXI.Container()
//   public floorSelection: FloorSelection
//   public game = Game.current
//   public maxHeight = 1
//   public room: Room

//   constructor() {
//     this.floorSelection = new FloorSelection()
//     this.container.addChild(this.floorSelection)
//     this.container.sortableChildren = true
//     this.setWalls()
//     this.setFloor()
//   }

//   tintFloor(blocks: number[][], color: number) {
//     for (const [x, y] of blocks) {
//       const sprite = this.floorSprites.get(x, y)
//       sprite.tint = color
//     }

//     return this
//   }

//   setFloor() {
//     const { model } = this.room
//     const { map } = model
//     const { generateFloorTileTexture, generateStairTexture } = Game.current.imager.room
//     let textureCache: Texture = null
//     const stairCache: Record<number, Texture> = {}

//     this.floorSprites = this.floorSprites || new Matrix<Floor>(map.width, map.height)

//     for (const [[x, y], tile] of map.entries()) {
//       if (tile === 0) continue

//       let sprite: Floor
//       const neighbors = map.neighborsOf(x, y)
//       const stairType = getStairType(neighbors) as StairDirection

//       if (typeof stairType === 'number') {
//         const texture = stairCache[stairType] || (stairCache[stairType] = generateStairTexture(stairType))
//         sprite = new Floor(texture, new IsoPoint(x, y, tile))
//       } else {
//         const texture = textureCache || (textureCache = generateFloorTileTexture())
//         sprite = new Floor(texture, new IsoPoint(x, y, tile - 1))
//       }

//       if (!sprite) continue

//       sprite.position
//         .scale(32)
//         .toPoint()
//         .copyTo(sprite.position)

//       const isDoor = x === this.room.model.doorX && y === this.room.model.doorY

//       if (isDoor) {
//         sprite.tint = 0xff0000
//         sprite.zIndex = PRIORITY_DOOR_FLOOR
//       }

//       sprite.zIndex = calculateZIndex(x, y, tile, isDoor ? PRIORITY_DOOR_FLOOR : PRIORITY_FLOOR)

//       this.floorSprites.set(x, y, sprite)
//       this.container.addChild(sprite)

//       sprite
//         .addListener('pointerover', () => this.hoverFloor(sprite))
//         .addListener('pointertap', () => this.selectFloor(sprite))
//     }
//   }

//   setWalls() {
//     this.wallSprites = new Matrix()
//     const { model } = this.room
//     const { map } = model

//     // Obtém a altura do quarto
//     const roomHeight = map.reduce((max, f) => Math.max(max, f), 1)
//     // Altura mínima da parede
//     const wallHeight = 120

//     // Percorre as Linhas do mapa
//     for (const [y, col] of map.rowsEntries()) {
//       for (const [x, z] of col.entries()) {
//         // z === 0 Não tem piso
//         // z é a altura do piso

//         // Calcula a altura da parede atual
//         const currentWallHeight = wallHeight + (roomHeight - z) * 32


//         // this.addWall(
//         //   x, // Posição x da parede
//         //   y, // Posição y da parede
//         //   1, // tipo da parede 0 ou 1
//         //   new IsoPoint(x, y, z), // Posição da parede na tela
//         //   currentWallHeight, // Altura da parede
//         //   largura, // Largura da parede
//         //   porta, // A parede é uma porta?
//         //   canto // A parede é um canto?
//         // )
//       }
//     }

    
//   }

//   addWall(
//     x: number,
//     y: number,
//     direction: number,
//     position: IsoPoint,
//     height: number,
//     width: number,
//     door: boolean = false,
//     conner = false,
//   ) {
//     const wall = new Wall(this.game.imager.room.generateWallTexture(direction, width, height, door, 8, conner))

//     wall.zIndex = direction === 1 ? PRIORITY_WALL_H : PRIORITY_WALL_V

//     const spritePosition = position.copy().scale(32)

//     if (direction === 0) {
//       if (door) {
//         spritePosition.add(0, 0, 80)
//       }
//       spritePosition.add(0, 8, wall.height - 52)
//     } else if (direction === 1) {
//       spritePosition.add(32, 0, height - 20)
//     }

//     spritePosition.toPoint().copyTo(wall.position)

//     this.wallSprites.set(x, y, wall)
//     this.container.addChild(wall)
//   }

//   hoverFloor(x: number, y: number)
//   hoverFloor(floor: Floor)
//   hoverFloor(xOrFloor: number | Floor, y?: number) {
//     const sprite = xOrFloor instanceof Floor ? xOrFloor : this.floorSprites.get(xOrFloor, y)
//     this.floorSelection.position.copyFrom(sprite.position)
//     this.floorSelection.zIndex = sprite.zIndex + 1
//     this.floorSelection.visible = true
//   }

//   selectFloor(x: number, y: number)
//   selectFloor(floor: Floor)
//   selectFloor(xOrFloor: number | Floor, y?: number) {
//     const sprite = xOrFloor instanceof Floor ? xOrFloor : this.floorSprites.get(xOrFloor, y)
//     const { x: posX, y: posY } = sprite.position

//     this.game.net.send(new MessageRequestUserMovement(posX, posY))
//   }

//   dispose() {}
// }

// export const calculateZIndex = (x: number, y: number, z: number, priority: number): number => {
//   return (x + y) * COMPARABLE_X_Y + z * COMPARABLE_Z + PRIORITY_MULTIPLIER * priority
// }

// const _calculateZIndexUser = (x: number, y: number, z: number, priority: number): number => {
//   return calculateZIndex(Math.floor(x), Math.floor(y), z + 0.001, priority)
// }

// export function calculateZIndexUser(x: number, y: number, z: number): number {
//   const model = this.room.model
//   return _calculateZIndexUser(
//     x,
//     y,
//     z,
//     model.doorX === x && model.doorY === y ? PRIORITY_DOOR_FLOOR_PLAYER : PRIORITY_PLAYER,
//   )
// }

// const PRIORITY_WALL_H = 1
// const PRIORITY_DOOR_FLOOR = 0
// const PRIORITY_DOOR_FLOOR_PLAYER = 1
// const PRIORITY_WALL_DOOR_H = 1
// const PRIORITY_WALL_V = 0
// const PRIORITY_FLOOR = 3
// const PRIORITY_PLAYER = 11

// const PRIORITY_MULTIPLIER = 10000000
// const COMPARABLE_X_Y = 1000000
// const COMPARABLE_Z = 10000
