import * as PIXI from 'pixi.js';

import Room from './Room'
import { Matrix } from '../../engine/lib/util/Matrix'
import { createFloorTestFunction } from '../../engine/lib/util/FloorUtils'
import { Game } from '../Game'
import ladders from './floor/ladders'
import { Texture } from 'pixi.js'
import { StairDirection } from '../imager/Room.imager'
import { IsoPoint } from '../../engine/lib/IsoPoint'
import { Floor } from './floor/Floor'
import { FloorSelection } from './floor/FloorSelection'
import { MessageRequestUserMovement } from '../network/outgoing/MessageRequestUserMovement'
import { Wall } from './wall/Wall'

function getStairType(blocks: Matrix<number>): number {
  const hasLadder = createFloorTestFunction(blocks)
  const l = ladders.find(l => hasLadder(l.test))
  return l && l.value
}

export class RoomEngine {
  public floorSprites: Matrix<Floor>
  public wallSprites: Matrix<Wall>
  public container = new PIXI.Container()
  public floorSelection: FloorSelection
  public game = Game.current
  public maxHeight = 1

  constructor(public room: Room) {
    this.floorSelection = new FloorSelection()
    this.container.addChild(this.floorSelection)
    this.container.sortableChildren = true
    this.setWalls()
    this.setFloor()
  }

  tintFloor (blocks: number[][], color: number) {
    for (const [x, y] of blocks) {
      const sprite = this.floorSprites.get(x, y)
      sprite.tint = color
    }

    return this
  }

  setFloor() {
    const { model } = this.room
    const { map } = model
    const { generateFloorTileTexture, generateStairTexture } = Game.current.imager.room
    let textureCache: Texture = null
    const stairCache: Record<number, Texture> = {}

    this.floorSprites = this.floorSprites || new Matrix<Floor>(map.width, map.height)

    for (const [[x, y], tile] of map.entries()) {
      if (tile === 0) continue

      let sprite: Floor
      const neighbors = map.neighborsOf(x, y)
      const stairType = getStairType(neighbors) as StairDirection

      if (typeof stairType === 'number') {
        const texture = stairCache[stairType] || (stairCache[stairType] = generateStairTexture(stairType))
        sprite = new Floor(texture, new IsoPoint(x, y, tile))
      } else {
        const texture = textureCache || (textureCache = generateFloorTileTexture())
        sprite = new Floor(texture, new IsoPoint(x, y, tile - 1))
      }

      if (!sprite) continue

      sprite.positionInMap
        .scale(32)
        .toPoint()
        .copyTo(sprite.position)
      
      sprite.zIndex = calculateZIndex(
        x,
        y,
        tile,
        x === this.room.model.doorX && y === this.room.model.doorY ? PRIORITY_DOOR_FLOOR : PRIORITY_FLOOR,
      )

      this.floorSprites.set(x, y, sprite)
      this.container.addChild(sprite)

      sprite
        .addListener('pointerover', () => this.hoverFloor(sprite))
        .addListener('pointertap', () => this.selectFloor(sprite))
    }
  }

  _addWallSprite(texture: Texture, direction: number, position = new IsoPoint(), offset = new IsoPoint(), priority: number) {
    const sprite = new Wall(texture, position, direction)
    position
      .copy()
      .scale(32, 32, 0)
      .add(offset)
      .toPoint()
      .copyTo(sprite.position)

    sprite.zIndex = calculateZIndex(position.x, position.y, position.z, priority)

    this.container.addChild(sprite)
    return sprite
  }

  setWalls() {
    const { map } = this.room.model
    this.wallSprites = this.wallSprites || new Matrix<Wall>(map.width, map.height)

    const { imager } = this.game
    const { model } = this.room

    this.maxHeight = model.map.reduce<number>((max, z) => Math.max(max, z), 1)

    let startWallH = Infinity

    const height = this.maxHeight * 120

    wallsLoop:
    for (const [y, row] of map.rowsEntries()) {
      for (const [x, col] of row.entries()) {
        if (col === 0) continue;
        if (x === model.doorX && y === model.doorY) continue;

        const direction = 1
        
        for (let wy = y; wy >= 0; wy--) {
          const block = this.wallSprites.get(x, wy)
          if (block && block.direction === 1) continue wallsLoop;
        }

        const door = y > 0 && y - 1 === model.doorY && x === model.doorX
        const texture = imager.room.generateWallTexture(height, direction, door)
        const offset = new IsoPoint(0, 0, height - 4)
        const sprite = this._addWallSprite(
          texture,
          direction,
          new IsoPoint(x, y, col),
          offset,
          door ? PRIORITY_WALL_DOOR_H  : PRIORITY_WALL_H
        )
        
        this.wallSprites.set(x, y, sprite)
        
        if (x < startWallH) startWallH = x
      }
    }

    let maxVX = Infinity
    let endVX = -Infinity

    for (const [y, row] of map.rowsEntries()) {
      for (const [x, col] of row.entries()) {
        if (!col) continue;
        if (x > maxVX) break;
        if (x === model.doorX && y === model.doorY) continue;
        
        maxVX = x

        if (endVX < x) endVX = x;

        const door = x > 0 && x - 1 === model.doorX && y === model.doorY
        const direction = 0
        const conner = !!this.wallSprites.get(x, y)
        const texture = imager.room.generateWallTexture(height, direction, door, 8, conner)
        const offset = new IsoPoint(-8, 0, height - 4)

        const sprite = this._addWallSprite(
          texture,
          direction,
          new IsoPoint(x, y, col),
          offset,
          PRIORITY_WALL_V
        )

        this.wallSprites.set(x, y, sprite)
      }
    }
  }

  hoverFloor(x: number, y: number)
  hoverFloor(floor: Floor)
  hoverFloor(xOrFloor: number | Floor, y?: number) {
    const sprite = xOrFloor instanceof Floor ? xOrFloor : this.floorSprites.get(xOrFloor, y)
    this.floorSelection.position.copyFrom(sprite.position)
    this.floorSelection.zIndex = sprite.zIndex + 1
    this.floorSelection.visible = true
  }

  selectFloor(x: number, y: number)
  selectFloor(floor: Floor)
  selectFloor(xOrFloor: number | Floor, y?: number) {
    const sprite = xOrFloor instanceof Floor ? xOrFloor : this.floorSprites.get(xOrFloor, y)
    const { x: posX, y: posY } = sprite.positionInMap

    this.game.net.send(new MessageRequestUserMovement(posX, posY))
  }

  dispose() {}
}

export const calculateZIndex = (x: number, y: number, z: number, priority: number): number => {
  return (x + y) * COMPARABLE_X_Y + z * COMPARABLE_Z + PRIORITY_MULTIPLIER * priority
}

const _calculateZIndexUser = (x: number, y: number, z: number, priority: number): number => {
  return calculateZIndex(Math.floor(x), Math.floor(y), z + 0.001, priority)
}

export function calculateZIndexUser(x: number, y: number, z: number): number {
  const model = this.room.model
  return _calculateZIndexUser(
    x,
    y,
    z,
    model.doorX === x && model.doorY === y ? PRIORITY_DOOR_FLOOR_PLAYER : PRIORITY_PLAYER,
  )
}

const PRIORITY_WALL_H = 1;
const PRIORITY_DOOR_FLOOR = 0
const PRIORITY_DOOR_FLOOR_PLAYER = 1
const PRIORITY_WALL_DOOR_H = 1;
const PRIORITY_WALL_V = 0;
const PRIORITY_FLOOR = 3
const PRIORITY_PLAYER = 11

const PRIORITY_MULTIPLIER = 10000000
const COMPARABLE_X_Y = 1000000
const COMPARABLE_Z = 10000
