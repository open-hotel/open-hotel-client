import * as PIXI from 'pixi.js'

export class IsometricUtils {
  static cartToIso(x: number, y: number, z: number = 0) {
    const isoX = x - y
    const isoY = (x + y) / 2 - z
    return new PIXI.Point(isoX, isoY)
  }

  static isoToCart(isoX: number, isoY: number, isoZ: number = 0) {
    isoY += isoZ
    const cartX = (2 * isoY + isoX) / 2
    const cartY = (2 * isoY - isoX) / 2
    return new PIXI.Point(cartX, cartY)
  }
}
