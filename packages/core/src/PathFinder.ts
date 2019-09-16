interface Vector2 {
  x: number
  y: number
}

type PathFinderHeuristic = (a: PNode, b: PNode, instance?: PathFinder) => number
type CanWalkFunction = (cell: PNode, current: PNode) => boolean

function processNeighbors(grid: PNode[][], current: PNode, start: PNode, goal: PNode, instance: PathFinder) {
  const neighbors = []

  const prevX = current.x - 1
  const nextX = current.x + 1
  const prevY = current.y - 1
  const nextY = current.y + 1

  const top = grid[prevY] && grid[prevY][current.x]
  const left = grid[current.y] && grid[current.y][prevX]
  const right = grid[current.y] && grid[current.y][nextX]
  const bottom = grid[nextY] && grid[nextY][current.x]

  const topLeft = grid[prevY] && grid[prevY][prevX]
  const topRight = grid[prevY] && grid[prevY][nextX]
  const bottomLeft = grid[nextY] && grid[nextY][prevX]
  const bottomRight = grid[nextY] && grid[nextY][nextX]

  const possibleNeighbors = [top, left, right, bottom]

  if (instance.diagonalEnabled) {
    possibleNeighbors.push(topLeft, topRight, bottomRight, bottomLeft)
  }

  for (const block of possibleNeighbors) {
    if (block && !block.closed && block.walkable && instance.canWalk(block, current)) {
      block.parent = current
      block.closed = true
      block.g = instance.heuristic(block, start, instance)
      block.h = instance.heuristic(block, goal, instance) + instance.getCostsOf(block)
      neighbors.push(block)
    }
  }
  return neighbors
}

class PNode {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public walkable = false,
    public g: number = 0,
    public h: number = 0,
    public parent: PNode = null,
    public closed: boolean = false,
  ) {}

  get f() {
    return this.g + this.h
  }
}

class Grid {
  public readonly nodes: PNode[][] = []

  constructor(public readonly grid: number[][] = []) {
    let rows = grid.length
    let cols = grid[0].length

    for (let y = 0; y < rows; y++) {
      this.nodes[y] = []
      for (let x = 0; x < cols; x++) {
        this.nodes[y][x] = new PNode(x, y, grid[y][x], grid[y][x] !== 0)
      }
    }
  }

  clone() {
    return new Grid(Array.from(this.grid))
  }
}

function getPath(node: PNode) {
  let path = []

  while (node.parent) {
    path.unshift({ x: node.x, y: node.y })
    node = node.parent
  }

  return path
}

const { abs, sqrt, max, min } = Math

export class PathFinder {
  static DIAGONAL_COST = 1.4
  static STRAIGHT_COST = 1
  static Heuristic = {
    Manhattan: (a: PNode, b: PNode, instance: PathFinder) => {
      const dx = abs(a.x - b.x)
      const dy = abs(a.x - b.x)

      if (instance.diagonalEnabled) {
        return dx < dy ? PathFinder.DIAGONAL_COST * dx + dy : PathFinder.DIAGONAL_COST * dy + dx
      }

      return dx + dy
    },
    Euclidean: (a: PNode, b: PNode) => sqrt((a.x - b.x) ** 2 + (a.x - b.x) ** 2),
  }

  public heuristic: PathFinderHeuristic = PathFinder.Heuristic.Manhattan
  public grid: Grid
  public diagonalEnabled = true
  private costs: {
    test: (block: PNode) => boolean
    cost: number
  }[] = []

  addAdditionalCost(test: (block: PNode) => boolean, cost = 1) {
    this.costs.push({ cost, test })
    return this
  }

  getCostsOf(block: PNode) {
    return this.costs.filter(item => item.test(block)).reduce((sum, item) => sum + item.cost, 0)
  }

  constructor(grid: Grid | number[][] = [], public canWalk: CanWalkFunction = () => true) {
    if (grid instanceof Grid) this.grid = grid
    else if (Array.isArray(grid)) this.grid = new Grid(grid)
  }

  find(start: Vector2, end: Vector2): any[] {
    const { nodes } = this.grid.clone()
    const startNode = nodes[start.y] && nodes[start.y][start.x]
    const goalNode = nodes[end.y] && nodes[end.y][end.x]

    if (!startNode || !goalNode) return null
    if (startNode === goalNode) return []

    let currentNode: PNode
    let opened: PNode[] = [startNode]

    const closed: PNode[] = []

    while ((currentNode = opened.shift())) {
      const neighbors = processNeighbors(nodes, currentNode, startNode, goalNode, this).sort((a, b) => a.f - b.f)

      currentNode.closed = true
      closed.push(currentNode)

      // Chegou ao fim
      if (currentNode === goalNode) return getPath(currentNode)
      opened = opened.concat(neighbors).sort((a, b) => a.f - b.f)
    }

    // Não encontrou
    return null
  }
}
