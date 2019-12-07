import * as PIXI from 'pixi.js';
import { Game } from '../../Game'
import { HumanChunk } from './HumanChunk'
import { SCALE_MODES } from 'pixi.js'

type HumanImagerFigure = Record<string, { id: string; color?: string }>
type HumanImagerAction = Record<string, boolean | string>

export interface HumanImagerProps {
  figure: HumanImagerFigure
  action: HumanImagerAction
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

  normalizeFrameNumber(part: HumanChunk, frame: number, delay = 0) {
    const resource = Game.current.app.loader.resources[part.lib]
    const { animations = {} } = resource ? resource.spritesheet : {}
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
        if (c === 'figure') return this.encodeFigure(props.figure)
        if (c === 'action') return this.encodeAction(props.action)
        return props[c]
      })
      .join(';')
  }

  encodeFigure(figure: HumanImagerFigure): string {
    return Object.entries(figure)
      .map(([key, { id, color }]) => (color ? [key, id, color] : [key, id]).join('-'))
      .join('.')
  }

  decodeFigure(figure: string): HumanImagerFigure {
    return figure.split('.').reduce<HumanImagerFigure>((fig, part) => {
      const [key = '', id = '1', color = null] = part.split('-')

      fig[key] = {
        id,
        color,
      }

      return fig
    }, {})
  }

  encodeAction(action: HumanImagerAction) {
    return Object.entries(action)
      .reduce((acc, [action, value]) => {
        if (value === true) acc.push(action)
        else if (value) acc.push([action, value].join('='))
        return acc
      }, [])
      .join(',')
  }

  decodeAction(action: string) {
    return action.split(',').reduce<HumanImagerAction>((acc, item) => {
      const [name, value = true] = item.split('=')
      acc[name] = value
      return acc
    }, {})
  }

  getColor(paletteId: string, colorId: string) {
    const {
      figuredata: { data: figureData },
    } = Game.current.app.loader.resources

    const palette = figureData.palette[paletteId]
    const { color = null } = (palette && palette[colorId]) || {}

    return Number(`0x${color || 'FFFFFF'}`)
  }

  getPalettePart(part: string) {
    const {
      figuredata: { data: figureData },
    } = Game.current.app.loader.resources
    const setType = figureData.settype[part]
    return setType ? setType.paletteid : '1'
  }

  getFigureOptions(
    type: string,
    figure: HumanImagerFigure,
    defaults: { type?: string; id?: string; tint?: number } = {},
  ) {
    const { resources } = Game.current.app.loader
    const {
      figuremap: { data: figureMap },
    } = resources
    const part = figure[type]

    if (!part) {
      return {
        type,
        id: null,
        lib: figureMap[type][defaults.id],
        tint: 0xffffff,
        frame: 0,
        ...defaults,
      }
    }

    const { id, color } = part

    return {
      type,
      id: id,
      lib: figureMap[type][id],
      tint: this.getColor(this.getPalettePart(type), color),
      frame: 0
    }
  }

  async generateTexture(props: Partial<HumanImagerProps>) {
    props = Object.assign(
      {
        figure: {},
        action: {},
        direction: 2,
        gesture: 'std',
        frame: 0,
        head_direction: 2,
        size: 'h',
        is_ghost: false,
      },
      props,
    )

    const cacheName = this.createCacheName(props)

    if (cacheName in this.textureCache) return this.textureCache[cacheName]

    // Prepare parts
    const parts = this.createParts(props)

    await Game.current.app.getLibs(this.getResources(parts))

    return this.renderParts(parts, cacheName)
  }

  createParts(props: Partial<HumanImagerProps>) {
    let { action, direction, figure, frame, gesture, head_direction, is_ghost, size = 'h' } = props
    const hdFigure = this.getFigureOptions('hd', figure, { id: '1' })

    // Body Layers
    const parts: Record<string, HumanChunk> = {
      // Head
      hd: new HumanChunk({
        ...hdFigure,
        direction: head_direction,
        size: size,
      }),
      // Body
      bd: new HumanChunk({
        ...this.getFigureOptions('bd', figure, { id: '1' }),
        tint: hdFigure.tint,
        direction: direction,
        size: size,
      }),
      // Left Hand
      lh: new HumanChunk({
        ...this.getFigureOptions('lh', figure, { id: '1' }),
        tint: hdFigure.tint,
        direction: direction,
        size: size,
      }),
      // Right Hand
      rh: new HumanChunk({
        ...this.getFigureOptions('rh', figure, { id: '1' }),
        tint: hdFigure.tint,
        direction: direction,
        size: size,
      }),
    }

    // Actions Normalize
    if (action.wlk) {
      action.sit = action.lay = false
    }

    if (action.sit) {
      action.wlk = action.lay = false
    }

    if (action.lay) {
      if (['wav'].includes(gesture)) gesture = 'std'
      action.wlk = action.sit = action.drk = action.sig = action.crr = false
    }

    if (is_ghost) {
      parts.hd.tint = parts.bd.tint = parts.lh.tint = parts.rh.tint = 0xffffff
    } else {
      // Hair Layer
      if (figure.hr) {
        parts.hr = new HumanChunk({
          ...this.getFigureOptions('hr', figure),
          direction: head_direction,
          size: size,
        })
      }

      // Eye Layer
      if (figure.ey) {
        parts.ey = new HumanChunk({
          ...this.getFigureOptions('ey', figure),
          direction: head_direction,
          size: size,
        })
      }

      // Face Layer
      if (figure.fc) {
        parts.fc = new HumanChunk({
          ...this.getFigureOptions('fc', figure),
          tint: hdFigure.tint,
          direction: head_direction,
          size: size,
        })
      }

      // Hats Layer
      if (figure.ha) {
        parts.ha = new HumanChunk({
          ...this.getFigureOptions('ha', figure),
          direction: direction,
          size: size,
        })
      }

      // Eye accessories Layer
      if (figure.ea) {
        parts.ea = new HumanChunk({
          ...this.getFigureOptions('ea', figure),
          direction: head_direction,
          size: size,
        })
      }

      // Head accessories Layer
      if (figure.he) {
        parts.he = new HumanChunk({
          ...this.getFigureOptions('he', figure),
          direction: head_direction,
          size: size,
        })
      }

      // Drinks Layer
      if ((action.drk || action.crr) && !action.blw) {
        parts.ri = new HumanChunk({
          lib: 'hh_human_item',
          type: 'ri',
          action: action.drk ? 'drk' : 'crr',
          id: (action.drk || action.crr) as string,
          direction: direction,
          size: size,
        })
      }

      // Signals
      if (action.sig) {
        parts.li = new HumanChunk({
          lib: 'hh_human_item',
          type: 'li',
          action: 'sig',
          id: action.sig as string,
          direction: direction,
          size: size,
        })
      }
    }

    // Speak
    if (action.spk) {
      for (const type of ['hd', 'fc']) {
        if (parts[type]) {
          parts[type].action = 'spk'
          parts[type].frame = this.normalizeFrameNumber(parts[type], frame)
        }
      }
    }

    // Walk
    if (action.wlk) {
      for (const type of ['bd', 'lh', 'rh']) {
        if (parts[type]) {
          parts[type].action = 'wlk'
          parts[type].frame = this.normalizeFrameNumber(parts[type], frame)
        }
      }
    }

    // Sit
    if (action.sit) {
      for (const type of ['bd']) {
        if (parts[type]) parts[type].action = 'sit'
      }
    }

    // Lay
    if (action.lay) {
      for (const type of ['bd', 'hd', 'lh', 'rh', 'fc', 'ey', 'hr', 'ha', 'he', 'ea']) {
        if (parts[type]) parts[type].action = 'lay'
      }
    }

    // Right Items
    if (action.crr) {
      for (const type of ['rh']) {
        if (parts[type]) {
          parts[type].action = 'crr'
          parts[type].frame = 0
        }
      }
    }

    // Drinks
    if (action.drk) {
      for (const type of ['rh']) {
        if (parts[type]) {
          parts[type].action = 'drk'
          parts[type].frame = 0
        }
      }
    }

    // Signal
    if (action.sig) {
      gesture = 'std'
      for (const type of ['lh']) {
        if (parts[type]) {
          parts[type].action = 'sig'
          parts[type].frame = 0
        }
      }
    }

    // Wave
    if (gesture === 'wav') {
      for (const type of ['lh']) {
        if (parts[type]) {
          parts[type].action = 'wav'
          parts[type].frame = this.normalizeFrameNumber(parts[type], frame)
        }
      }
    } else if (['sml', 'agr', 'srp', 'sad'].includes(gesture)) {
      for (const type of ['ey', 'fc']) {
        if (parts[type]) {
          parts[type].action = gesture
          parts[type].frame = this.normalizeFrameNumber(parts[type], frame)
        }
      }
    }

    // Blow
    if (action.blw) {
      for (const type of ['rh']) {
        if (parts[type]) {
          parts[type].action = 'blw'
          parts[type].frame = this.normalizeFrameNumber(parts[type], frame, 4)
        }
      }
    }

    // Eye Blink
    if (action.eyb) {
      for (const type of ['ey']) {
        if (parts[type]) {
          parts[type].action = 'eyb'
          parts[type].frame = this.normalizeFrameNumber(parts[type], frame, 4)
        }
      }
    }

    return parts
  }

  renderParts(parts: Record<string, HumanChunk>, cacheName: string) {
    const { app } = Game.current
    const { resources } = app.loader
    const {
      draworder: { data: drawOrder },
    } = resources
    let drawAction: string

    if (parts.bd) {
      if (parts.bd.action === 'sit') {
        drawAction = 'sit'
      } else if (parts.bd.action === 'lay') {
        drawAction = 'lay'
      }
    }

    if (parts.lh) {
      if (['sig', 'crr', 'wav'].includes(parts.lh.action)) {
        drawAction = drawAction ? `${drawAction}.lh-up` : 'lh-up'
      }
    }

    if (parts.rh) {
      if (['drk', 'crr', 'blw'].includes(parts.rh.action) && !/lh-up$/.test(drawAction)) {
        drawAction = drawAction ? `${drawAction}.rh-up` : 'rh-up'
      }
    }

    drawAction = drawAction || 'std'

    // Render
    const g = new PIXI.Container()
    const fallbackDrawAction = drawOrder[drawAction.split('.')[0]] || drawOrder.std
    const order = drawOrder[drawAction] || fallbackDrawAction

    if (!order) return PIXI.Texture.EMPTY

    const orderDirection =
      order[parts.bd.direction] || fallbackDrawAction[parts.bd.direction] || drawOrder.std[parts.bd.direction]

    if (!orderDirection) return PIXI.Texture.EMPTY

    const rect = new PIXI.Rectangle(9, -79, 39, 86);

    for (const type of orderDirection) {
      if (parts[type]) {
        const part = parts[type]
        if (!part.texture) console.log(part.filename, part.spritesheet)
        const sprite = new PIXI.Sprite(part.texture)
        const spritesheet = part.spritesheet;
        const offset = spritesheet ? spritesheet.data.meta.offset[part.filename] : { x: 0, y: 0 }

        if (offset) sprite.pivot.set(Number(offset.x), Number(offset.y))
        sprite.tint = part.tint

        g.addChild(sprite)
      }
    }

    return (this.textureCache[cacheName] = app.renderer.generateTexture(
      g,
      SCALE_MODES.NEAREST,
      1,
      rect,
    ))
  }

  getResources(parts: Record<string, HumanChunk>) {
    return Object.values(parts)
      .map(p => p.lib)
      .filter(lib => lib && !Game.current.app.loader.resources[lib])
  }

  async createAnimation(props: Partial<HumanImagerProps>) {
    const cacheName = this.createCacheName(props, [
      ...(props.is_ghost ? [] : ['figure']),
      'action',
      'size',
      'gesture',
      'head_direction',
      'direction',
    ])

    if (cacheName in this.animationCache) return this.animationCache[cacheName]

    const parts = this.createParts(props)
    const maxFrameCount = Object.values(parts).reduce((max, part) => max + part.animation.length, 1)
    const animation = new Array(maxFrameCount).fill(null).map((_, frame) =>
      this.generateTexture({
        ...props,
        frame,
      }),
    )

    return (this.animationCache[cacheName] = await Promise.all(animation))
  }
}
