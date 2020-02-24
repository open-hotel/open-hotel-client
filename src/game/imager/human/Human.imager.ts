import * as PIXI from 'pixi.js'
import async from 'promise-async'
import merge from 'lodash.merge'

import { Game } from '../../Game'
import { HumanPart, calcFlip } from './HumanPart'
import { HumanActions } from './action.util'
import { HumanFigure } from './figure.util'
import { mmc } from '../../../engine/lib/util/Util'

export type FigurePartList = Record<string, HumanPart[]>

export interface HumanFigureProps {
  figure: HumanFigure
  actions: HumanActions
  size?: 'h' | 'sh'
  head_direction: number
  direction: number
  is_ghost: boolean
}

interface FigureRenderOptions {
  parts: FigurePartList
  geometry: PIXI.Rectangle
  drawOrder: {
    type: string
    direction: number
  }
}

export interface FigureAnimationFrame {
  number: number
  repeats?: number
  action?: string
}

export interface FigureAnimation {
  frames: Record<string, FigureAnimationFrame>[]
  offsets?: { dx: number; dy: number }
}

export class HumanImager {
  private getData(name: string) {
    return Game.current.app.loader.resources[name].data
  }

  get figuremap() {
    return this.getData('figuremap')
  }

  get figuredata() {
    return this.getData('figuredata')
  }

  get draworder() {
    return this.getData('draworder')
  }

  get partsets() {
    return this.getData('partsets')
  }

  get avatarActions(): { state; precedence } {
    return this.getData('avatarActions')
  }

  get geometry() {
    return this.getData('geometry')
  }

  get animations() {
    return this.getData('animations')
  }

  private get actionsTranslator() {
    return Object.entries(this.avatarActions).reduce(
      (acc, [name, { state }]) => ({
        ...acc,
        [state]: name,
      }),
      {},
    )
  }

  private getSetType(type: string, id: string) {
    const setType = this.figuredata.settype[type] || {}
    return setType.set && setType.set[id]
  }

  private getLib(type: string, id: string) {
    const { libs, parts } = this.figuremap
    const libIndex = parts[type][id]
    let lib = libs[libIndex]

    if (!lib && type === 'hrb') {
      lib = libs[parts['hr'][id]]
    }

    return lib && lib.id
  }

  private getColor(paletteId: string, colorId: string) {
    const { palette } = this.figuredata
    const { color } = palette[paletteId][colorId]
    return parseInt(color, 16)
  }

  private getColorForPart(type: string, colorId: string) {
    const { paletteid } = this.figuredata.settype[type]
    return this.getColor(paletteid, colorId)
  }

  private getActivePartset(parts: FigurePartList, name: string): HumanPart[] {
    const activePartSets = this.partsets.activePartSets[name]
    if (!activePartSets) return []
    return Object.entries(parts).reduce((acc, [type, parts]) => {
      if (activePartSets.includes(type)) {
        return acc.concat(parts)
      }
      return acc
    }, [])
  }

  private getGeometry(name: string, size: 'h' | 'sh'): PIXI.Rectangle {
    const { dx, dy, width, height } = this.geometry.canvas[size][name]
    return new PIXI.Rectangle(dx * -1, dy, width, height)
  }

  private downloadMissing(partList: FigurePartList) {
    const libs = new Set(
      Object.values(partList)
        .flat()
        .filter(p => !p.libLoaded)
        .map(part => part.lib),
    )
    return Game.current.app.getLibs([...libs])
  }

  createPartList(props: HumanFigureProps): FigureRenderOptions {
    props = Object.assign(props, {
      size: props.size || 'h',
    })

    const partList: FigurePartList = {}
    const head = new Set<string>(this.partsets.activePartSets.head)

    let drawOrderName = 'std'
    let drawOrderAction: string

    for (const [type, { id, colors }] of Object.entries(props.figure)) {
      const setType = this.getSetType(type, id)

      // Hidden Layers
      if (setType.hiddenlayers) {
        for (const type of setType.hiddenlayers) {
          delete partList[type]
        }
      }

      for (const part of setType.parts) {
        const partSet = this.partsets.partSets[part.type]
        const colorId = part.colorable && part.colorindex > 0 ? colors[part.colorindex - 1] : null
        const color = colorId && this.getColorForPart(type, colorId)
        const figurePart = new HumanPart({
          lib: this.getLib(part.type, part.id),
          id: part.id,
          type: part.type,
          direction: head.has(part.type) ? props.head_direction : props.direction,
          color: part.type !== 'ey' ? color : null,
          flippedType: partSet.flipped_type,
        })

        partList[part.type] = partList[part.type] || []
        partList[part.type].push(figurePart)
      }
    }

    const state = new Set()

    // Actions
    for (const [action, value] of Object.entries(props.actions).sort(([a], [b]) => {
      const actionA = this.avatarActions[this.actionsTranslator[a]]
      const actionB = this.avatarActions[this.actionsTranslator[b]]
      const precedenceA = actionA ? actionA.precedence : 0
      const precedenceB = actionB ? actionB.precedence : 0
      return precedenceB - precedenceA
    })) {
      const animationName = this.actionsTranslator[action]
      const actionDef = this.avatarActions[animationName]
      if (!actionDef) continue
      const prevents: string[] = actionDef.prevents ? actionDef.prevents.split(',') : []

      if (prevents.some(s => state.has(s))) continue

      state.add(animationName)

      if (actionDef.state) {
        state.add(actionDef.state)
        if (actionDef.state === 'fx') {
          state.add(actionDef.state + '.' + value)
        }
      }

      if (actionDef.state === 'sign' && typeof value == 'string') {
        partList.li = [
          new HumanPart({
            lib: 'hh_human_item',
            type: 'li',
            id: value,
            direction: head.has('li') ? props.head_direction : props.direction,
          }),
        ]
      } else if ((actionDef.state === 'cri' || actionDef.state === 'usei') && typeof value == 'string') {
        partList.ri = [
          new HumanPart({
            lib: 'hh_human_item',
            type: 'ri',
            id: actionDef.params[value],
            direction: head.has('ri') ? props.head_direction : props.direction,
          }),
        ]
      }

      if (actionDef.state === 'lay') {
        drawOrderName = 'lay'
      } else if (actionDef.state === 'std') {
        drawOrderName = 'std'
      }

      if (actionDef.activepartset) {
        for (const part of this.getActivePartset(partList, actionDef.activepartset)) {
          part.action = actionDef.assetpartdefinition
        }

        if (actionDef.activepartset === 'sit') {
          drawOrderName = 'sit'
        } else if (actionDef.activepartset === 'handRight' || actionDef.activepartset === 'handRightAndHead') {
          drawOrderAction = 'lh-up'
        } else if (actionDef.activepartset === 'handLeft' || actionDef.activepartset === 'handLeftAndHead') {
          drawOrderAction = 'lh-up'
        }
      }
    }

    if (drawOrderAction) {
      drawOrderName = drawOrderName === 'std' ? drawOrderAction : drawOrderName + '.' + drawOrderAction
    }

    return {
      parts: partList,
      geometry: this.getGeometry('vertical', 'h'),
      drawOrder: {
        type: drawOrderName,
        direction: props.direction,
      },
    }
  }

  private getDrawOrder(name: string, direction: string | number): string[] {
    const order = this.draworder[name] && this.draworder[name][direction]
    if (!order) {
      console.warn(`Draworder ${name}[${direction}] not found!`)
    }

    return order
  }

  async render({ parts, drawOrder, geometry }: FigureRenderOptions) {
    await this.downloadMissing(parts)

    const container = new PIXI.Graphics()

    // Geometry

    let order =
      this.getDrawOrder(drawOrder.type, drawOrder.direction) || this.getDrawOrder('std', calcFlip(drawOrder.direction))
    order.forEach(type => {
      if (!parts[type]) return
      parts[type].forEach(figurePart => {
        let texture = figurePart.getTexureWith()
        let offset = figurePart.getOffset()
        let isTextureFlipped = false

        if (figurePart.isFlipDirection) {
          const type = figurePart.flippedType || figurePart.type
          if (!texture) {
            texture = figurePart.getTexureWith({
              type,
              direction: figurePart.flipedDirection,
            })
            offset = figurePart.getOffset({
              type,
              direction: figurePart.flipedDirection,
            })
            isTextureFlipped = true
          }
        }

        texture =
          texture ||
          figurePart.getTexureWith({
            action: 'std',
            frame: 0,
            direction: figurePart.flipedDirection,
          })

        offset = offset ||
          figurePart.getOffset({
            action: 'std',
            frame: 0,
            direction: figurePart.flipedDirection,
          }) || { x: 0, y: 0 }

        const sprite = new PIXI.Sprite(texture)

        sprite.name = `${type}_${figurePart.id}`

        if (figurePart.color) {
          sprite.tint = figurePart.color
        }

        if (isTextureFlipped) {
          sprite.scale.x = -1
          sprite.pivot.set(geometry.width + offset.x - 22, offset.y - geometry.height + 8)
        } else {
          sprite.pivot.set(offset.x, offset.y - geometry.height + 8)
        }

        container.addChild(sprite)
      })
    })

    return Game.current.app.renderer.generateTexture(container, PIXI.SCALE_MODES.NEAREST, 1, geometry)
  }

  getAnimations(props: HumanFigureProps): FigureAnimation[] {
    return Object.keys(props.actions)
      .map(a => this.actionsTranslator[a])
      .filter(a => !!a)
      .sort((a, b) => {
        const actionA = this.avatarActions[a]
        const actionB = this.avatarActions[b]
        const precedenceA = actionA ? actionA.precedence : 0
        const precedenceB = actionB ? actionB.precedence : 0
        return precedenceB - precedenceA
      })
      .map(a => this.animations[a])
  }

  async getAnimation(props: HumanFigureProps): Promise<PIXI.Texture[]> {
    const renderProps = this.createPartList(props)
    const animations = this.getAnimations(props)

    // Calcula o total de frames da animação
    const qtFrames = mmc(
      ...animations.map(({ frames }) => frames.reduce((sum, f) => {
        const repeats = Object.values(f).reduce((sum, p) => Math.max(p.repeats || 0, sum), 0) || 1;
        return sum + repeats;
      }, 0))
    )

    const textures = [];
    const texturesProps = new Array(qtFrames).fill(null).map(() => merge({}, renderProps));
    const qtAnimations = animations.length

    // Se não houverem animações, renderizar um frame
    if (!qtAnimations) return [await this.render(renderProps)]

    // Se não, criar frames
    for (let i = 0; i < qtFrames; i++) {
      // Copia as propriedades para gerar um novo frame
      const frameRenderProps = texturesProps[i]

      // Percorre todas as animações
      for (let a = 0; a < qtAnimations; a++) {
        const animation = animations[a]
        // Número do frame é cíclico
        // com base na quantidade de frames da animação
        const f = i % animation.frames.length
        const frame = animation.frames[f]

        // Aplica propriedades do frame em cada parte
        for (let type in frame) {
          const { action, repeats = 1 } = frame[type]

          if (!(type in frameRenderProps.parts)) continue

          for (let fi = i; fi < i + repeats; fi++) {
            const props = texturesProps[fi]
            props.parts[type].forEach(part => {
              console.log(type, action, f)
              part.action = action
              part.frame = f
            })
          }
        }
      }

      // Renderiza a textura e adiciona na lista de texturas
      textures.push(await this.render(frameRenderProps))
    }

    return textures
  }
}
