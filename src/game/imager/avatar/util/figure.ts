import { FigureDataSettypeKey } from '../types'

export type HumanFigure = Record<
  FigureDataSettypeKey,
  {
    id: string
    colors?: string[]
  }
>

export module HumanFigure {
  /**
   * Convert object figure to string
   * @param figure Figure Dictionary
   */
  export function encode(figure: HumanFigure): string {
    return Object.keys(figure)
      .map(f => [f, figure[f].id, ...(figure[f].colors || [])].join('-'))
      .join('.')
  }
  /**
   * Convert string to figure object
   * @param figure Figure String
   */
  export function decode(figure: string): HumanFigure {
    return figure
      .split('.')
      .map(part => part.split('-'))
      .reduce((obj, [type, id, ...colors]) => ({ ...obj, [type]: { id, colors } }), <HumanFigure>{})
  }

  export function getLib (figuremap: Record<string, any>, type: string, id: string | number) {
    const libraryIndex = figuremap.parts[type][id]
    const lib = figuremap.libs[libraryIndex]?.id
    if (!lib) {
      if (type === 'hrb') {
        return getLib(figuremap, 'hr', id)
      }
      if (type === 'ls' || type === 'rs') {
        return getLib(figuremap, 'ch', id)
      }
    }
    return lib
  }

  export function isFromPartSet (partsets: Record<string, any>, partSet: string, partType: string) {
    return new Set(partsets.activePartSets[partSet]).has(partType)
  }

}
