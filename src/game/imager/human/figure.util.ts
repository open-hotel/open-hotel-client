export type HumanFigure = Record<
  string,
  {
    id: string
    colors?: string[]
  }
>

export namespace Figure {
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
      .reduce((obj, [type, id, ...colors]) => ({ ...obj, [type]: { id, colors } }), {})
  }
}
