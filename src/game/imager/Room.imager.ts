import { SCALE_MODES, Polygon, Graphics } from "pixi.js";
import { Cube, CubeOptions } from "../../engine/geometry/Cube";
import { Vector3 } from "../../engine/isometric";
import { Application } from "../../engine/Application";
import { IsoPoint } from "../../engine/lib/IsoPoint";
import { Game } from "../Game";

export type StairDirection = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

const DEFAULT_THICKNESS = 8
const TEXTURE_RESOLUTION = window.devicePixelRatio * 3;

function createStairSteps(cb: Function, thickness: number = DEFAULT_THICKNESS) {
  return new Array(4).fill(null).map((_, index) => {
    const {
      height = thickness,
      depth = thickness,
      width = thickness,
      position = new Vector3()
    } = cb(index)
    return new Cube({ depth, height, width, position })
  })
}

export class RoomImager {
  wallsCache: Record<string, PIXI.Texture> = {}

  generateFloorTileTexture (thickness: number = DEFAULT_THICKNESS) {
    const floor = new Cube({
      depth: 32,
      height: thickness,
      width: 32,
    })

    const borderStroke = new Polygon([
      new Vector3(1, 31, 0).toVector2(),
      new Vector3(1, 1, 0).toVector2(),
      new Vector3(31, 1, 0).toVector2(),
    ])

    borderStroke.closeStroke = false

    floor.lineStyle(2, 0x000000, 0.05)
    floor.drawShape(borderStroke)

    return Application.get().renderer.generateTexture(floor, SCALE_MODES.NEAREST, TEXTURE_RESOLUTION)
  }

  generateStairTexture (direction: StairDirection, thickness: number = DEFAULT_THICKNESS) {
    const g = new Graphics()

    const border = new Graphics()
    const borderPolygon = new Polygon()

    let hitArea = new Polygon([
      new Vector3(32, 0).toVector2(),
      new Vector3(64, 0).toVector2(),
      new Vector3(64, 32).toVector2(),
      new Vector3(31, 32).toVector2(),
    ])

    if (direction === 0) {
      g.addChild(
        ...createStairSteps((i: number) => ({
          width: 32,
          position: new Vector3(0, (i / 4) * 32, 8 * i - 32),
        })),
      )

      hitArea = new Polygon([
        new Vector3(32, 16).toVector2(),
        new Vector3(78, 16).toVector2(),
        new Vector3(78, 32).toVector2(),
        new Vector3(31, 32).toVector2(),
      ])
    } else if (direction === 1) {
      g.addChild(
        ...createStairSteps((i: number) => {
          const size = 32 - (i / 4) * 32
          return {
            width: size,
            depth: size,
            position: new Vector3(0, 32 - size, 8 * i - 24),
          }
        }),
      )

      hitArea = new Polygon([
        new Vector3(16, 8, 0).toVector2(),
        new Vector3(64, 0, -16).toVector2(),
        new Vector3(64, 32, -16).toVector2(),
        new Vector3(31, 32, 16).toVector2(),
      ])
    } else if (direction === 2) {
      g.addChild(
        ...createStairSteps((i: number) => ({
          depth: 32,
          position: new Vector3((i / -4) * 32, 0, 8 * i),
        })),
      )

      hitArea = new Polygon([
        new Vector3(32, 0, 16).toVector2(),
        new Vector3(64, 0, -16).toVector2(),
        new Vector3(64, 32, -16).toVector2(),
        new Vector3(31, 32, 16).toVector2(),
      ])
    } else if (direction === 3) {
      g.addChild(
        ...createStairSteps((i: number) => {
          const size = 32 - (i / 4) * 32
          return {
            width: size,
            depth: size,
            position: new Vector3(0, 0, 8 * i),
          }
        }),
      )

      hitArea = new Polygon([
        new Vector3(32, 0, 16).toVector2(),
        new Vector3(64, 0, -16).toVector2(),
        new Vector3(64, 32, -16).toVector2(),
        new Vector3(31, 32, -16).toVector2(),
      ])
    } else if (direction === 4) {
      g.addChild(
        ...createStairSteps((i: number) => ({
          width: 32,
          position: new Vector3(0, (i / -4) * 32, 8 * i),
        })),
      )
      hitArea = new Polygon([
        new Vector3(32, 0, 16).toVector2(),
        new Vector3(64, 0, 16).toVector2(),
        new Vector3(64, 32, -16).toVector2(),
        new Vector3(32, 32, -16).toVector2(),
      ])
    } else if (direction === 5) {
      g.addChild(
        ...createStairSteps((i: number) => {
          const size = 32 - (i / 4) * 32
          return {
            width: size,
            depth: size,
            position: new Vector3(32 - size, 0, 8 * i - 24),
          }
        }),
      )

      hitArea = new Polygon([
        new Vector3(54, 0, 16).toVector2(),
        new Vector3(64, 0, 16).toVector2(),
        new Vector3(64, 32, -16).toVector2(),
        new Vector3(32, 32, -16).toVector2(),
      ])
    } else if (direction === 6) {
      g.addChild(
        ...createStairSteps((i: number) => ({
          depth: 32,
          position: new Vector3((i / 4) * 32, 16, 8 * i - 16),
        })),
      )

      hitArea = new Polygon([
        new Vector3(40, -16).toVector2(),
        new Vector3(56, -16).toVector2(),
        new Vector3(56, 48).toVector2(),
        new Vector3(40, 48).toVector2(),
      ])
    } else if (direction === 7) {
      g.addChild(
        ...createStairSteps((i: number) => {
          const size = 32 - (i / 4) * 32
          return {
            width: size,
            depth: size,
            position: new Vector3(64 - size, 64 - size, 8 * i),
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

    return Application.get().renderer.generateTexture(g, SCALE_MODES.NEAREST, TEXTURE_RESOLUTION)
  }

  generateWallTexture (
    direction: number,
    width = 32,
    height = 100,
    door = false,
    thickness = 8,
    conner = false
  ) {
    const cacheName = [direction, width, height, door, thickness, conner].join('_')
    if (cacheName in this.wallsCache) return this.wallsCache[cacheName]

    if (door) {
      height -= 80
    }

    const cubeOptions: CubeOptions = {
      height: height,
      position: new Vector3(0, 0, 0),
      colors: {
        top: 0x6f717a,
        front: 0x9597a3,
        left: 0xb6b8c7,
      },
    }

    const walls = new Graphics()

    
    if (conner) {
      walls.addChild(
        new Cube({
          ...cubeOptions,
          position: new Vector3(0, -thickness, 0),
          width: thickness,
          depth: thickness,
        })
      )
    }
    
    if (direction === 1) {
      walls.addChild(
        new Cube({
          ...cubeOptions,
          width: width,
          depth: thickness,
        })
      )
    }

    if (direction === 0) {
      walls.addChild(
        new Cube({
          ...cubeOptions,
          width: thickness,
          depth: width,
        })
      )
    }

    return this.wallsCache[cacheName] = Application.get().renderer.generateTexture(walls, SCALE_MODES.NEAREST, TEXTURE_RESOLUTION)
  }

  generateFloorSelectionTexture () {
    const g = new Graphics()

    const polygon = new Polygon([
      new IsoPoint(0, 0).toPoint(),
      new IsoPoint(32, 0).toPoint(),
      new IsoPoint(32, 32).toPoint(),
      new IsoPoint(0, 32).toPoint(),
    ])
    
    g.lineStyle(2, 0xff73ba, 1, 0)
    g.drawPolygon(polygon)

    return Game.current.app.renderer.generateTexture(g, SCALE_MODES.NEAREST, TEXTURE_RESOLUTION)
  }
}