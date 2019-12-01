import { Matrix } from "./Matrix"

export const createFloorTestFunction = (map: Matrix<number>) => (test: Matrix<string>) => {
  const current = map.get(1, 1)
  return map.every((mapCol, x, y) => {
    const blockTest: string = test.get(x, y)
    const splitblockTest = blockTest.split('|')

    return splitblockTest.some(t => {
      if (t === '*') return true
      if (t === '!') return mapCol === undefined || mapCol === null
      if (t === '?') return !mapCol
      if (t === '#') return mapCol > 0

      const elevation = current + Number(t.replace(/[^\d-]/g, ''))
      
      return mapCol === elevation
    })
  })
}
