import { PathFinder } from '../src/engine/lib/utils/PathFinder'
import tests from './map-matches'
import { isEqual } from 'lodash'

const drawMap = (map: number[][], path: { x: number; y: number }[], start: { x: number; y: number }) => {
  let lines = map.map((col, y) =>
    col.map((row, x) => {
      const walkHere = path.findIndex(p => p.x === x && p.y === y)
      if (row === 0) return '#'
      if (start.x === x && start.y === y) return 'o'
      if (walkHere < 0) return '.'
      if (walkHere === path.length - 1) return 'x'
      return '*'
    }),
  )

  const result = lines.map(item => item.join(' ')).join('\n')
  console.log(result)

  return result
}

describe('Deve retornar o caminho mais curto', () => {
  for (let test of tests) {
    it(test.description, () => {
      const { map, heuristic, diagonals } = test
      const spec = test.spec.map(item => item.join('\n'))
      const start = { x: test.start[0], y: test.start[1] }
      const end = { x: test.end[0], y: test.end[1] }
      const finder = new PathFinder(map)
      finder.heuristic = PathFinder.Heuristic[heuristic]
      finder.diagonalEnabled = !!diagonals
      const path = finder.find(start, end)

      const result = drawMap(map, path, start)
      expect(spec).toContainEqual(result)
    })
  }
})
