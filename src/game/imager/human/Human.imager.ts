import * as PIXI from 'pixi.js'
import { Game } from '../../Game'
import { HumanChunk } from './HumanChunk'

type HumanImagerFigure = Record<string, { id: string; colors?: string[] }>
type HumanImagerAction = Record<string, boolean | string>

export class Figure {
  constructor(public attrs: HumanImagerFigure) {}

  static encode(figure: HumanImagerFigure) {
    return Object.entries(figure)
      .map(([key, { id, colors = [] }]) => ([key, id, ...colors]).join('-'))
      .join('.')
  }

  static decode(figureEncoded: string) {
    return figureEncoded.split('.').reduce<HumanImagerFigure>((fig, part) => {
      const [key = '', id = '1', ...colors] = part.split('-')

      fig[key] = {
        id,
        colors
      }

      return fig
    }, {})
  }

  static from(figureEncoded: string) {
    return new Figure(this.decode(figureEncoded))
  }

  set(type: string, id: string, ...colors: string[]) {
    this.attrs[type] = { id, colors }
    return this
  }

  get(type: string) {
    return this.attrs[type]
  }

  toString() {
    return Figure.encode(this.attrs)
  }

  entries() {
    return Object.entries(this.attrs)
  }
}

export class Action {
  constructor(public attrs: HumanImagerAction) {}

  static encode(action: HumanImagerAction) {
    return Object.entries(action)
      .reduce((acc, [action, value]) => {
        if (value === true) acc.push(action)
        else if (value) acc.push([action, value].join('='))
        return acc
      }, [])
      .join(',')
  }

  static decode(actionEncoded: string) {
    return actionEncoded.split(',').reduce<HumanImagerAction>((acc, item) => {
      const [name, value = true] = item.split('=')
      acc[name] = value
      return acc
    }, {})
  }

  get(action: string) {
    return this.attrs[action]
  }

  set(action: string, value: boolean | string = true) {
    if (value === false) {
      delete this.attrs[action]
    } else {
      this.attrs[action] = value
    }

    return this
  }

  static from(figureEncoded: string) {
    return new Action(this.decode(figureEncoded))
  }

  toString() {
    return Action.encode(this.attrs)
  }
}

export interface HumanImagerProps {
  figure: string
  action: Record<string, string | boolean>
  size: string
  gesture: string
  head_direction: number
  direction: number
  frame: number
  is_ghost: boolean
}

export class HumanImager {
  textureCache: Record<string, PIXI.Texture> = {}
  animationCache: Record<string, PIXI.Texture[]> = {}

  get figuremap() {
    return Game.current.app.loader.resources.figuremap.data
  }

  get figuredata() {
    return Game.current.app.loader.resources.figuredata.data
  }

  get draworder() {
    return Game.current.app.loader.resources.draworder.data
  }

  get partsets() {
    return Game.current.app.loader.resources.partsets.data
  }

  normalizeFrameNumber(part: HumanChunk, frame: number, delay = 0) {
    const resource = Game.current.app.loader.resources[part.lib]
    const { animations = {} } = (resource && resource.spritesheet) || {}
    const animation = animations[part.resourceName] || []
    const total = animation.length
    if (!total) return 0
    delay = Math.max(1, delay)
    return Math.floor(frame / delay) % total
  }

  createCacheName(
    props: Partial<HumanImagerProps>,
    chunks = [
      ...(props.is_ghost ? [] : ['figure']),
      'action',
      'size',
      'gesture',
      'head_direction',
      'direction',
      'frame',
    ],
  ) {
    return chunks
      .map(c => {
        if (c === 'figure') return props.figure.toString()
        if (c === 'action') return props.action.toString()
        return props[c]
      })
      .join(';')
  }


  getColorFor(type:string, colorId:string) {
    const settype = this.figuredata.settype[type]
    const paletteid = settype && settype.paletteid
    const palette = this.figuredata.palette[paletteid]
    const color = palette && palette[colorId]
    return color ? parseInt(color.color, 16) : 0xffffff
  }

  async render(props: Partial<HumanImagerProps>): Promise<PIXI.Texture> {
    const parts = await this.createParts(props)
    const libs = this.getResources(parts)

    await Game.current.app.getLibs(libs)

    const figureContainer = new PIXI.Container()

    for (const part of parts) {
      const sprite = new PIXI.Sprite(part.texture)
      figureContainer.addChild(sprite)
      sprite.pivot.set(part.offset.x, part.offset.y)
      if (Number.isInteger(part.color)) sprite.tint = part.color
    }

    return Game.current.app.renderer.generateTexture(figureContainer, 1, 1)
  }

  getActivePartsets(parts: HumanChunk[], groupName: string) {
    return parts.filter(p => this.partsets.activePartSets[groupName].includes(p.type))
  }

  async createParts(props: Partial<HumanImagerProps>): Promise<HumanChunk[]> {
    const figure = Figure.from(props.figure)
    let parts: HumanChunk[] = []

    for (const [type, { id, colors }] of figure.entries()) {
      const { parts: subParts, hiddenlayers = null } = this.figuredata.settype[type].set[id]
      for (const subPart of subParts) {
        const libId = this.figuremap.parts[subPart.type][subPart.id]
        const lib = libId && this.figuremap.libs[libId]

        if (!lib) continue

        const part = new HumanChunk({
          lib: lib.id,
          id: subPart.id,
          type: subPart.type,
          color: subPart.colorable === 1 && subPart.colorindex > 0 && subPart.type !== 'ey'
            ? this.getColorFor(subPart.type, colors[subPart.colorindex - 1])
            : null,
          direction: props.direction,
        })

        parts.push(part)
      }

      if (Array.isArray(hiddenlayers)) {
        parts = parts.filter(p => !hiddenlayers.includes(p.type))
      }
    }

    for (const headPart of this.getActivePartsets(parts, 'head')) {
      headPart.direction = props.head_direction
    }

    const hrAction = props.gesture === 'blw' ? 'blw' : props.action.crr ? 'crr' : props.action.drk ? 'drk' : 'std'

    for (const handRight of this.getActivePartsets(parts, 'handRight')) {
      handRight.action = hrAction
    }

    const hlAction =
      props.gesture === 'respect'
        ? 'respect'
        : props.gesture === 'wav'
        ? 'wav'
        : props.action.crr
        ? 'crr'
        : props.action.sig
        ? 'sig'
        : 'std'

    for (const handLeft of this.getActivePartsets(parts, 'handLeft')) {
      handLeft.action = hlAction
    }

    const actionName = props.action.sit ? 'sit' : 'std'
    const order = this.draworder[actionName][props.direction]

    return parts.sort((a, b) => {
      const aIndex = order.indexOf(a.type)
      const bIndex = order.indexOf(b.type)

      return aIndex < 0 || bIndex < 0 ? 0 : aIndex - bIndex
    })
  }

  async createAnimation(props) {
    return [await this.render(props)]
  }

  getResources(parts: HumanChunk[]) {
    return Object.values(parts)
      .flat()
      .filter(p => !p.libLoaded)
      .map(p => p.lib)
  }
}
