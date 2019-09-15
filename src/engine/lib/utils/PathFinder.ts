interface Vector2 {
  x: number
  y: number
}

type PathFinderHeuristic = (a: PNode, b: PNode) => number
type CanWalkFunction = (cell: PNode, current: PNode) => boolean

function processNeighbors(
  grid: PNode[][],
  current: PNode,
  goal: PNode,
  heuristic: PathFinderHeuristic,
  canWalk: CanWalkFunction,
) {
  const neighbors = []

  const prevX = current.x - 1
  const nextX = current.x + 1
  const prevY = current.y - 1
  const nextY = current.y + 1

  const top = grid[prevY] && grid[prevY][current.x]
  const left = grid[current.y] && grid[current.y][prevX]
  const right = grid[current.y] && grid[current.y][nextX]
  const bottom = grid[nextY] && grid[nextY][current.x]

  // const diagTopLeft = grid[prevX] && grid[prevX][prevY]
  // const diagTopRight = grid[nextX] && grid[nextX][prevY]
  // const diagBottomLeft = grid[prevX] && grid[prevX][nextY]
  // const diagBottomRight = grid[nextX] && grid[nextX][nextY]

  // const possibleNeighbors = [top, left, right, bottom, diagTopLeft, diagTopRight, diagBottomLeft, diagBottomRight]
  const possibleNeighbors = [top, left, right, bottom]
  for (const block of possibleNeighbors) {
    if (block && !block.closed && block.walkable && canWalk(block, current)) {
      block.parent = current
      block.closed = true
      block.g = heuristic(block, current)
      block.h = heuristic(block, goal)
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

const { abs } = Math

export class PathFinder {
  static Heuristic = {
    Manhattan: (a: PNode, b: PNode) => abs(a.x - b.x) + abs(a.y - b.y) + abs(a.z - b.z),
  }

  public heuristic: PathFinderHeuristic = PathFinder.Heuristic.Manhattan
  public grid: Grid

  constructor(grid: Grid | number[][] = [], public canWalk: CanWalkFunction = () => true) {
    if (grid instanceof Grid) this.grid = grid
    else if (Array.isArray(grid)) this.grid = new Grid(grid)
  }

  find(start: Vector2, end: Vector2): any[] {
    const { nodes } = this.grid.clone()
    const startNode = nodes[start.y] && nodes[start.y][start.x]
    const goalNode = nodes[end.y] && nodes[end.y][end.x]
    const canWalk = this.canWalk.bind(this)

    if (!startNode || !goalNode) return null
    if (startNode === goalNode) return []

    let currentNode: PNode
    let opened: PNode[] = [startNode]

    const closed: PNode[] = []

    while ((currentNode = opened.shift())) {
      const neighbors = processNeighbors(nodes, currentNode, goalNode, this.heuristic, canWalk).sort(
        (a, b) => a.f - b.f,
      )

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
