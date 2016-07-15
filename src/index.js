const LEFT = 0
const UP = 1
const RIGHT = 2
const DOWN = 3
const DIRECTIONS = [LEFT, UP, RIGHT, DOWN]

const transposition = (array2d, nrow, ncol) => {
  const ret = []
  for (let i = 0; i < ncol; ++i) {
    ret[i] = []
    for (let j = 0; j < nrow; ++j) {
      ret[i][j] = array2d[j][i]
    }
  }
  return ret
}

const copy = (array2d) => {
  const nrow = array2d.length
  const ncol = array2d[0].length
  const ret = []
  for (let i = 0; i < nrow; ++i) {
    ret[i] = []
    for (let j = 0; j < ncol; ++j) {
      ret[i][j] = array2d[i][j]
    }
  }
  return ret
}

class Board {
  constructor(setup, options = {}) {
    this.position = copy(setup)
    this.nrow = setup.length
    this.ncol = setup[0].length

    this.depth = options.depth || 10
    this.sampling = options.sampling || 500
    this.target = options.target || 2048

    this.updateState()
  }

  updateState() {
    this.nZeroCells = 0
    this.isCleared = false
    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol; ++j) {
        if (this.position[i][j] === this.target) this.isCleared = true
        if (this.position[i][j] === 0) ++this.nZeroCells
      }
    }
    this.isOvered = this.nZeroCells === 0
  }

  copy() {
    return new Board(
      this.position,
      { depth: this.depth, sampling: this.sampling, target: this.target }
    )
  }

  add() {
    this.updateState()
    if (this.nZeroCells === 0) return
    let n = Math.floor(Math.random() * (this.nZeroCells))

    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol; ++j) {
        if (this.position[i][j] === 0 && n === 0) {
          this.position[i][j] = Math.random() < 0.9 ? 2 : 4;
          return;
        }
        if (this.position[i][j] === 0) --n;
      }
    }
  }

  move(direction) {
    this.preprocess(direction)
    const ret = this.merge()
    this.postprocess(direction)
    this.updateState()

    return ret
  }

  preprocess(direction) {
    switch (direction) {
      case RIGHT:
        this.reverseRow()
        break
      case UP:
        this.transposition()
        break
      case DOWN:
        this.transposition()
        this.reverseRow()
        break
      default:
        break
    }
  }

  postprocess(direction) {
    switch (direction) {
      case RIGHT:
        this.reverseRow()
        break
      case UP:
        this.transposition()
        break
      case DOWN:
        this.reverseRow()
        this.transposition()
        break
      default:
        break
    }
  }

  reverseRow() {
    let swaptmp
    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol / 2; ++j) {
        if (this.position[i][j] !== this.position[i][this.ncol - 1 - j]) {
          swaptmp = this.position[i][j]
          this.position[i][j] = this.position[i][this.ncol - 1 - j]
          this.position[i][this.ncol - 1 - j] = swaptmp
        }
      }
    }
  }

  transposition() {
    this.position = transposition(this.position, this.nrow, this.ncol)
  }

  merge() {
    let ret = false;

    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol - 1; ++j) {
        if (this.position[i][j] > 0 && this.position[i][j] === this.position[i][j + 1]) {
          this.position[i][j] = this.position[i][j] * 2;
          this.position[i][j + 1] = 0;
          ret = true;
        }
      }
    }

    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol - 1; ++j) {
        if (this.position[i][j] === 0) {
          for (let k = j + 1; k < this.ncol; ++k) {
            if (this.position[i][k] !== 0) {
              this.position[i][j] = this.position[i][k];
              this.position[i][k] = 0;
              ret = true;
              break;
            }
          }
        }
      }
    }

    return ret;
  }

  evaluate(direction) {
    const directionBoard = this.copy()
    if (!directionBoard.move(direction)) return -1
    if (directionBoard.isCleared) return directionBoard.nZeroCells * this.sampling

    let count = 0
    let samplingBoard

    for (let j = 0; j < this.sampling; ++j) {
      samplingBoard = directionBoard.copy()
      for (let k = 0; k < this.depth; ++k) {
        samplingBoard.add()

        if (samplingBoard.move(DIRECTIONS[Math.floor(Math.random() * 4)])) {
          if (samplingBoard.isCleared) break
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

  print() {
    return this.position.map((v) => v.map((vv) => `    ${vv}`.slice(-4)).join(' ')).join('\n')
  }

}

export { Board, LEFT, UP, RIGHT, DOWN, DIRECTIONS }
