export type HumanActions = Record<string, boolean | string>

export module HumanActions {
  /**
   * Convert object action to string
   * @param figure Action Dictionary
   */
  export function encode(action: HumanActions): string {
    return Object.entries(action)
      .filter(([a]) => !action[a] && typeof action[a] !== 'number')
      .map(([key, value]) => value === true ? key : [key, value].join('='))
      .join(',')
  }
  /**
   * Convert string to action object
   * @param figure Action String
   */
  export function decode(action: string): HumanActions {
    return action
      .split(',')
      .map(part => part.split('='))
      .reduce((obj, [key, value = true]) => ({ ...obj, [key]: value }), {})
  }
}
