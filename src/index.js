const LEFT = 0
const UP = 1
const RIGHT = 2
const DOWN = 3
const DIRECTIONS = [LEFT, UP, RIGHT, DOWN]

// const flatten = (array2d) => Array.prototype.concat.apply([], array2d)
const flatten = (array2d, nrow, ncol) => {
  const ret = new Array(nrow * ncol)
  for (let i = 0; i < nrow; ++i | 0) {
    for (let j = 0; j < ncol; ++j | 0) {
      ret[i * ncol + j] = array2d[i][j]
    }
  }
  return ret
}

// const transposition = (array2d) => array2d.map((v, i) => v.map((_, j) => array2d[j][i]))
const transposition = (array2d, nrow, ncol) => {
  const ret = Array.from(Array(ncol), () => new Array(nrow))
  for (let i = 0; i < nrow; ++i | 0) {
    for (let j = 0; j < ncol; ++j | 0) {
      ret[j][i] = array2d[i][j]
    }
  }
  return ret
}

// const innerReverse = (array2d) => array2d.map((v) => v.reverse())
const innerReverse = (array2d, nrow, ncol) => {
  const ret = Array.from(Array(ncol), () => new Array(nrow))
  for (let i = 0; i < nrow; ++i | 0) {
    for (let j = 0; j < ncol; ++j | 0) {
      ret[i][j] = array2d[i][ncol - j - 1]
    }
  }
  return ret
}

class Board {
  constructor(setup, options = {}) {
    this.position = JSON.parse(JSON.stringify(setup))
    this.nrow = setup.length
    this.ncol = setup[0].length

    this.depth = options.depth || 10
    this.sampling = options.sampling || 500
    this.target = options.target || 2048

    this.updateState()
  }

  updateState() {
    const position = flatten(this.position, this.nrow, this.ncol)
    this.isCleared = position.includes(this.target)
    this.isOvered = !position.includes(0)
    this.nZeroCells = 0
    for (let i = 0; i < position.length; ++i | 0) {
      if (position[i] === 0) ++this.nZeroCells
    }
  }

  copy() {
    return new Board(
      this.position,
      { depth: this.depth, sampling: this.sampling, target: this.target }
    )
  }

  add() {
    if (this.isOvered) return

    const valIndexes =
      flatten(
        this.position.map(
          (v, i) => v.map((_, j) => (this.position[i][j] > 0 ? undefined : [i, j]))
        ),
        this.nrow,
        this.ncol
      ).filter((v) => v !== undefined)

    const n = Math.floor(Math.random() * (this.nZeroCells))

    this.position[valIndexes[n][0]][valIndexes[n][1]] = Math.random() < 0.9 ? 2 : 4
    --this.nZeroCells
  }

  move(direction) {
    const previousPosition = this.position
    this.preprocess(direction)
    this.position = this.position.map((v) => this.merge(v))
    this.postprocess(direction)
    this.updateState()

    for (let i = 0; i < this.nrow; ++i | 0) {
      for (let j = 0; j < this.ncol; ++j | 0) {
        if (this.position[i][j] !== previousPosition[i][j]) return true
      }
    }
    return false
  }

  preprocess(direction) {
    switch (direction) {
      case RIGHT:
        this.position = innerReverse(this.position, this.nrow, this.ncol)
        break
      case UP:
        this.position = transposition(this.position, this.nrow, this.ncol)
        break
      case DOWN:
        this.position = innerReverse(
          transposition(this.position, this.nrow, this.ncol), this.nrow, this.ncol)
        break
      default:
        break
    }
  }

  postprocess(direction) {
    switch (direction) {
      case RIGHT:
        this.position = innerReverse(this.position, this.nrow, this.ncol)
        break
      case UP:
        this.position = transposition(this.position, this.nrow, this.ncol)
        break
      case DOWN:
        this.position = transposition(
          innerReverse(this.position, this.nrow, this.ncol), this.nrow, this.ncol)
        break
      default:
        break
    }
  }

  merge(_array) {
    const size = _array.length
    const array = _array.filter((v) => v > 0)
    for (let i = 0; i < array.length - 1; ++i | 0) {
      if (array[i] === array[i + 1]) {
        array[i] = array[i] * 2
        array[i + 1] = 0
      }
    }
    return array.filter((v) => v > 0)
      .concat(Array.from(Array(size), () => 0))
      .slice(0, size)
  }

  evaluate(direction) {
    const directionBoard = this.copy()
    if (!directionBoard.move(direction)) return -1
    if (directionBoard.isOvered) return 0
    if (directionBoard.isCleared) return directionBoard.nZeroCells

    let count = 0
    let samplingBoard
    directionBoard.add()

    for (let j = 0; j < this.sampling; ++j | 0) {
      samplingBoard = directionBoard.copy()
      for (let k = 0; k < this.depth; ++k | 0) {
        if (samplingBoard.move(DIRECTIONS[Math.floor(Math.random() * 4)])) {
          samplingBoard.add()
        } else {
          if (samplingBoard.isOvered) break
        }
      }
      count += samplingBoard.nZeroCells
    }

    return count
  }

  predict() {
    const evaluations = DIRECTIONS.map((v) => this.evaluate(v))
    return {
      direction: evaluations.indexOf(Math.max(...evaluations)),
      evaluations,
    }
  }
}

export { Board, LEFT, UP, RIGHT, DOWN, DIRECTIONS }
