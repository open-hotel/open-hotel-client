import { Matrix } from '@open-hotel/core'

export const createFloorTestFunction = (map: Matrix<number>) => (test: Matrix<string>) => {
  const current = map.get(1, 1)
  return map.every((mapCol, rowIndex, colIndex) => {
    const blockTest: string = test.get(rowIndex, colIndex)

    if (blockTest === '*') return true
    if (blockTest === '?') return !mapCol
    if (blockTest === '#') return mapCol > 0

    const splitblockTest = blockTest.split('|')

    return splitblockTest.some(t => {
      if (t === '?') return !mapCol
      if (t === '#') return mapCol > 0
      const elevation = current + parseInt(t.replace(/[^\d-]/g, ''))
      return mapCol === elevation
    })
  })
}
