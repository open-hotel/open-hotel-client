import PathFinding from 'pathfinding'

export interface PointLike { x: number; y: number }

// export class PathFinder {
//   public easystar = new EasyStar.js()
//   public currentTask: number

//   constructor (grid:number[][], walkable:number[] = [1,2,3,4,5,6,7,8,9]) {
//     this.easystar.setGrid(grid)
//     this.easystar.setAcceptableTiles(walkable)
//   }

//   async find (start: PointLike, end: PointLike): Promise<PointLike[]> {
//     this.easystar.cancelPath(this.currentTask)
//     return new Promise(resolve => {
//       this.easystar.findPath(start.x, start.y, end.x, end.y, resolve)
//       this.easystar.calculate()
//     })
//   }
// }

export class PathFinder {
    public grid: PathFinding.Grid;
    public finder: PathFinding.Finder

    constructor (grid: number[][]) {
        this.grid = new PathFinding.Grid(grid.map(r => r.map(c => c === 0 ? 1 : 0)))
        this.finder = new PathFinding.AStarFinder({
            heuristic: PathFinding.Heuristic.euclidean
        })
    }

    async find (start: PointLike, end: PointLike): Promise<PointLike[]> {
        return this.finder.findPath(start.x, start.y, end.x, end.y, this.grid.clone())
            .map(p => ({ x: p[0], y: p[1] }))
    }
}