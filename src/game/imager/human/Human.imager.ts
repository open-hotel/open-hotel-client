import * as PIXI from 'pixi.js-legacy'
import { mergeWith } from 'lodash'

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
  frame: number
  repeats?: number
  action?: string
  assetpartdefinition?: string
  dx?: number
  dy?: number
  dd?: number
}

export interface FigureAnimation {
  frames: Record<string, FigureAnimationFrame>[]
  offsets?: Array<{ dx: number; dy: number }>
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

  get effectmap() {
    return this.getData('effectmap')
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

  createPartList(props: HumanFigureProps): FigurePartList {
    props = Object.assign(props, {
      size: props.size || 'h',
    })

    const partList: FigurePartList = {}
    const head = new Set<string>(this.partsets.activePartSets.head)

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

    return partList
  }

  private getDrawOrder(name: string, direction: string | number): string[] {
    const order = this.draworder[name] && this.draworder[name][direction]

    return order
  }

  private getRenderOptions(actions: any[], props: HumanFigureProps) {
    const lastAction = actions[actions.length - 1]
    const isFlipDirection = calcFlip(props.direction) !== props.direction
    let type = []

    if (props.actions.sit) type.push('sit')
    else if (props.actions.lay) type.push('lay')

    if (new Set(['handLeft', 'handLeftAndHead']).has(lastAction.activepartset)) {
      type.push(isFlipDirection ? 'rh-up' : 'lh-up')
    }

    if (new Set(['handRight', 'handRightAndHead']).has(lastAction.activepartset)) {
      type.push(isFlipDirection ? 'lh-up' : 'rh-up')
    }

    if (type.length === 0) type = ['std']

    return {
      geometry: this.getGeometry(lastAction.geometrytype, props.size),
      drawOrder: {
        direction: props.direction,
        type: type.join('.'),
      },
    }
  }

  private getActions(props: HumanFigureProps) {
    let actions = Object.keys(props.actions)
      .map(a => this.avatarActions[this.actionsTranslator[a]])
      .filter(a => a)
      .sort((a, b) => b.precedence - a.precedence)

    actions.forEach(action => {
      const prevents = new Set((action.prevents || '').split(','))
      if (prevents.size > 0) {
        actions = actions.filter(a => {
          if (a.state === 'fx') {
            return !prevents.has([a.state, props.actions.fx].join('.'))
          }
          return !prevents.has(a.state)
        })
      }
    })

    return actions
  }

  async render({ parts, drawOrder, geometry }: FigureRenderOptions): Promise<PIXI.Texture> {
    await this.downloadMissing(parts)

    const imageContainer = new PIXI.Container()
    const body = new PIXI.Container()
    const flipedDirection = calcFlip(drawOrder.direction)

    imageContainer.addChild(body)
    // Geometry

    let order = this.getDrawOrder(drawOrder.type, drawOrder.direction)

    if (!order && flipedDirection !== drawOrder.direction) {
      order = this.getDrawOrder(drawOrder.type, flipedDirection)
    } else {
      console.log(drawOrder, this.draworder)
      order = this.getDrawOrder('std', drawOrder.direction) || this.getDrawOrder('std', flipedDirection)
    }

    const fxParts = Object.keys(parts).filter(p => !order.includes(p)).map(p => {
      parts[p].forEach(part => {
        part.isFX = true
      })
      return p
    })

    order.concat(fxParts).forEach(type => {
      if (!parts[type]) return false
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

        if (!texture) {
          if (figurePart.type === 'rs') {
            if (figurePart.assetpartdefinition === 'blw') {
              texture = figurePart.getTexureWith({ assetpartdefinition: 'drk' })
            }
          }
        }

        texture =
          texture ||
          figurePart.getTexureWith({
            assetpartdefinition: 'std',
            frame: 0,
            direction: figurePart.flipedDirection,
          })

        offset = offset ||
          figurePart.getOffset({
            assetpartdefinition: 'std',
            frame: 0,
            direction: figurePart.flipedDirection,
          }) || { x: 0, y: 0 }

        const sprite = new PIXI.Sprite(texture)

        sprite.name = `${type}_${figurePart.id}`

        if (typeof figurePart.color == 'number') {
          sprite.tint = figurePart.color
        }

        if (typeof figurePart.ink == 'number') {
          sprite.alpha = figurePart.ink / 100;
        }

        if (isTextureFlipped) {
          sprite.scale.x = -1
          sprite.pivot.set(geometry.width + offset.x - 24, offset.y - geometry.height + 8)
        } else {
          sprite.pivot.set(offset.x, offset.y - geometry.height + 8)
        }

        sprite.position.set(figurePart.dx, figurePart.dy)

        if (figurePart.isFX) {
          sprite.blendMode = PIXI.BLEND_MODES.ADD;
          imageContainer.addChild(sprite)
        }
        else body.addChild(sprite)
      })
    })

    console.log(imageContainer)

    return Game.current.app.renderer.generateTexture(imageContainer, PIXI.SCALE_MODES.NEAREST, 1, geometry)
  }

  async getAnimations(actions: any[], props: HumanFigureProps): Promise<FigureAnimation[]> {
    const animations: FigureAnimation[] = []
    const effects = new Set(['dance', 'fx'])

    for (const action of actions) {
      if (!action.animation) continue

      let animation: FigureAnimation
      let animationName = this.actionsTranslator[action.state]

      if (effects.has(action.state)) {
        if (action.state === 'fx') {
          const fx = action.types[props.actions.fx as string]
          if (!fx || fx.animated) continue
        }
        const id = props.actions[action.state]
        animationName = [action.state, id].join('.')
        const lib = this.effectmap[action.state][animationName]
        if (!lib) continue
        const resourceId = `${lib}/animations`
        const animations = await Game.current.app.getResource({
          [resourceId]: `${lib}/animations.json`,
        })

        Object.assign(this.animations, animations[resourceId].data)
      }

      animation = this.animations[animationName]

      if (animation) animations.push(animation)
    }

    return animations
  }

  async createAnimation(props: HumanFigureProps): Promise<PIXI.Texture[]> {
    const actions = this.getActions(props)
    const animations = await this.getAnimations(actions, props)
    const renderProps: FigureRenderOptions = {
      parts: this.createPartList(props),
      ...this.getRenderOptions(actions, props),
    }

    const itemActions = new Set(['cri', 'usei', 'sign'])

    // Prepare Actions
    for (const action of actions) {
      if (action.activepartset) {
        if (itemActions.has(action.state)) {
          let type = 'ri'
          let id = action.params
            ? String(action.params[props.actions[action.state]])
            : String(props.actions[action.state])

          if (action.state === 'sign') type = 'li'

          console.log(type)
          renderProps.parts[type] = (renderProps.parts[type] || []).concat(
            new HumanPart({
              lib: 'hh_human_item',
              type,
              id,
              direction: props.direction,
            }),
          )
        }

        for (const part of this.getActivePartset(renderProps.parts, action.activepartset)) {
          part.assetpartdefinition = action.assetpartdefinition
        }
      }

      if (action.state === 'fx') {
        const fxLib = this.effectmap.fx[props.actions.fx as string]
        const animationId = ['fx', props.actions.fx].join('.')
        const result = await Game.current.app.getResource({
          [fxLib]: `${fxLib}/${fxLib}.json`,
          [`${fxLib}/animations`]: `${fxLib}/animations.json`,
        })

        const spritesheet = result[fxLib].spritesheet
        const animation = result[`${fxLib}/animations`].data[animationId]

        if (animation.sprites) {
          for (const p in animation.sprites) {
            const part = animation.sprites[p]

            const [assetpartdefinition, id] = part.member.split(new RegExp(`${p}|_`)).filter(f => f)

            const fxPart = new HumanPart({
              lib: fxLib,
              type: p,
              id,
              direction: props.direction,
              assetpartdefinition,
              ink: part.ink,
            })

            renderProps.parts[fxPart.type] = [fxPart]
          }
        }
      }

      console.log(action)
    }

    await this.downloadMissing(renderProps.parts)

    // Animations
    const animationsFrames = animations.map(animation => {
      return animation.frames.reduce((sum, frame) => sum + mmc(Object.values(frame).map(p => p.repeats || 1)), 0)
    })
    const qtFrames = mmc(animationsFrames)

    const textures = new Array(qtFrames)
    const texturesProps = new Array(qtFrames)
      .fill(null)
      .map<FigureRenderOptions>(() => mergeWith({}, renderProps, HumanPart.merge))

    for (const a in animations) {
      const animation = animations[a]
      const qtAnimationFrames = animationsFrames[a]
      const lenFrames = animation.frames.length

      console.groupCollapsed('Animation', a, qtAnimationFrames)

      for (let animationFrameIndex = 0; animationFrameIndex < qtFrames; animationFrameIndex += qtAnimationFrames) {
        for (let f = 0; f < qtAnimationFrames; f++) {
          const fa = f % lenFrames
          const fi = f % qtAnimationFrames
          const frame = animation.frames[fa]

          for (const p in frame) {
            const part = frame[p]
            const repeats = part.repeats || 1
            const partTypes: string[] = this.partsets.activePartSets[p] || [p]

            for (let r = 0; r < repeats; r++) {
              const i = animationFrameIndex + fi * repeats + r

              partTypes.forEach(type => {
                if (texturesProps[i] && texturesProps[i].parts[type]) {
                  texturesProps[i].parts[type].forEach(partItem => {
                    const assetpartdefinition =
                      part.action &&
                      this.avatarActions[part.action] &&
                      this.avatarActions[part.action].assetpartdefinition

                    partItem.frame = part.frame
                    partItem.assetpartdefinition = assetpartdefinition || part.assetpartdefinition
                    partItem.dx = part.dx
                    partItem.dy = part.dy

                    console.log(partItem)

                    if (part.dd) {
                      partItem.direction += part.dd
                      partItem.direction %= 8
                      if (partItem.direction < 0) partItem.direction = 7 + partItem.direction
                      if (partItem.direction > 7) partItem.direction = 7 - partItem.direction
                    }

                    if (!partItem.assetpartdefinition) {
                      delete texturesProps[i].parts[type]
                      return
                    }

                    const offsets =
                      (animation.offsets && animation.offsets[fi] && animation.offsets[fi][partItem.direction]) || {}

                    for (const partSet in offsets) {
                      this.getActivePartset(texturesProps[i].parts, partSet).forEach(part => {
                        part.dx = offsets[partSet].dx
                        part.dy = offsets[partSet].dy
                      })
                    }
                  })
                }
              })
            }
          }
        }
      }

      console.groupEnd()
    }

    console.log(animations)
    for (let i = 0; i < qtFrames; i++) {
      textures[i] = await this.render(texturesProps[i])
    }

    return textures
  }
}
