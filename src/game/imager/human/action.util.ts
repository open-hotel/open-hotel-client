export type ActionType = 'lay' | 'float' | 'swim' | 'sit' | 'sb360' | 'sbollie' | 'sbup' | 'sbsq' | 'ridejump' | 'respect' | 'wave' | 'sign' | 'blow' | 'laugh' | 'idle' | 'fx' | 'dance' | 'usei' | 'cri' | 'talk' | 'gest' | 'sml' | 'sad' | 'agr' | 'srp' | 'Sleep' | 'mv' | 'std'
export type HumanActions = Record<ActionType, boolean | string>

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
      .reduce<any>((obj, [key, value = true]) => ({ ...obj, [key]: value }), {})
  }
}
