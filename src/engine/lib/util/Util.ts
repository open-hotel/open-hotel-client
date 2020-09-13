export function random(start = 0, end = 1, floor = true) {
  const value = Math.random() * (end - start + 1) + start
  return floor ? Math.floor(value) : value
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

export function gcd(a: number, b: number) {
  if (b === 0) return a
  return gcd(b, a % b)
}

export function lcm(num: number[]): number
export function lcm(...num: number[]): number
export function lcm(...args: Array<number | number[]>) {
  const numbers = [...new Set(args.flat())]
  let ans = numbers[0]

  for (let i = 1; i < numbers.length; i++) {
    ans = (numbers[i] * ans) / gcd(numbers[i], ans)
  }

  return ans
}
