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

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

export function mmc(num: number[]): number
export function mmc(...num: number[]): number;
export function mmc(...args: Array<number|number[]>): number {
  let num = Array.from(new Set(args.flat()))
  let mmc = 1

  while (!num.every(n => n === 1)) {
    for (let i = 0; i < PRIMES.length; i++) {
      const p = PRIMES[i]
      let divide = false

      num = num.map(n => {
        if (n !== 1 && n % p === 0) {
          divide = true
          return n / p
        }
        return n
      })

      if (divide) {
        mmc *= p
        break
      }
    }
  }

  return mmc
}
