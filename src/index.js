const LEFT = 0
const UP = 1
const RIGHT = 2
const DOWN = 3
const DIRECTIONS = [LEFT, UP, RIGHT, DOWN]

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
    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol; ++j) {
        if (this.position[i][j] === 0) ++this.nZeroCells
      }
    }
    this.isOvered = this.nZeroCells === 0
  }

  isCleared() {
    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol; ++j) {
        if (this.position[i][j] === this.target) return true
      }
    }
    return false
  }

  copy() {
    return new Board(
      this.position,
      { depth: this.depth, sampling: this.sampling, target: this.target }
    )
  }

  add() {
    if (this.nZeroCells === 0) return
    let n = Math.floor(Math.random() * (this.nZeroCells))

    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol; ++j) {
        if (this.position[i][j] === 0 && n === 0) {
          this.position[i][j] = Math.random() < 0.9 ? 2 : 4;
          --this.nZeroCells
          return;
        }
        if (this.position[i][j] === 0) --n;
      }
    }
  }

  isLeftMovable() {
    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol - 1; ++j) {
        if (this.position[i][j] > 0 && this.position[i][j] === this.position[i][j + 1]) {
          return true
        }
      }
    }

    for (let i = 0; i < this.nrow; ++i) {
      for (let j = 0; j < this.ncol - 1; ++j) {
        if (this.position[i][j] === 0) {
          for (let k = j + 1; k < this.ncol; --k) {
            if (this.position[i][k] !== 0) return true
          }
        }
      }
    }

    return false
  }

  isRightMovable() {
    for (let i = 0; i < this.nrow; ++i) {
      for (let j = this.ncol - 1; j > 0; --j) {
        if (this.position[i][j] > 0 && this.position[i][j] === this.position[i][j - 1]) {
          return true
        }
      }
    }

    for (let i = 0; i < this.nrow; ++i) {
      for (let j = this.ncol - 1; j >= 0; --j) {
        if (this.position[i][j] === 0) {
          for (let k = j - 1; k >= 0; --k) {
            if (this.position[i][k] !== 0) {
              return true
            }
          }
        }
      }
    }
    return false;
  }


  isUpMovable() {
    for (let j = 0; j < this.ncol; ++j) {
      for (let i = 0; i < this.nrow - 1; ++i) {
        if (this.position[i][j] > 0 && this.position[i][j] === this.position[i + 1][j]) {
          return true
        }
      }
    }

    for (let j = 0; j < this.ncol; ++j) {
      for (let i = 0; i < this.nrow - 1; ++i) {
        if (this.position[i][j] === 0) {
          for (let k = j + 1; k < this.nrow; ++k) {
            if (this.position[k][j] !== 0) {
              return true
            }
          }
        }
      }
    }

    return false;
  }

  isDownMovable() {
    for (let j = 0; j < this.ncol; ++j) {
      for (let i = this.nrow - 1; i > 0; --i) {
        if (this.position[i][j] > 0 && this.position[i][j] === this.position[i - 1][j]) {
          return true
        }
      }
    }

    for (let j = 0; j < this.ncol; ++j) {
      for (let i = this.nrow - 1; i >= 0; --i) {
        if (this.position[i][j] === 0) {
          for (let k = i - 1; k >= 0; --k) {
            if (this.position[k][j] !== 0) {
              return true
            }
          }
        }
      }
    }

    return false;
  }

  isMovable(direction) {
    switch (direction) {
      case LEFT:
        return this.isLeftMovable()
      case RIGHT:
        return this.isRightMovable()
      case UP:
        return this.isUpMovable()
      case DOWN:
        return this.isDownMovable()
      default:
        return false
    }
  }

  randomMove() {
    const directions = [-1, -1, -1, -1]
    let ndirections = 0
    for (let i = 0; i < 4; ++i) {
      if (this.isMovable(i)) {
        directions[ndirections] = i
        ++ndirections
      }
    }
    if (ndirections === 0) return false
    this.move(directions[Math.floor(Math.random() * ndirections)])
    return true
  }

  move(direction) {
    let ret
    switch (direction) {
      case LEFT:
        ret = this.leftMove()
        break
      case RIGHT:
        ret = this.rightMove()
        break
      case UP:
        ret = this.upMove()
        break
      case DOWN:
        ret = this.downMove()
        break
      default:
        return false
    }
    if (ret) this.updateState()
    return ret
  }

  leftMove() {
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

  rightMove() {
    let ret = false;

    for (let i = 0; i < this.nrow; ++i) {
      for (let j = this.ncol - 1; j > 0; --j) {
        if (this.position[i][j] > 0 && this.position[i][j] === this.position[i][j - 1]) {
          this.position[i][j] = this.position[i][j] * 2;
          this.position[i][j - 1] = 0;
          ret = true;
        }
      }
    }

    for (let i = 0; i < this.nrow; ++i) {
      for (let j = this.ncol - 1; j >= 0; --j) {
        if (this.position[i][j] === 0) {
          for (let k = j - 1; k >= 0; --k) {
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


  upMove() {
    let ret = false;

    for (let j = 0; j < this.ncol; ++j) {
      for (let i = 0; i < this.nrow - 1; ++i) {
        if (this.position[i][j] > 0 && this.position[i][j] === this.position[i + 1][j]) {
          this.position[i][j] = this.position[i][j] * 2;
          this.position[i + 1][j] = 0;
          ret = true;
        }
      }
    }

    for (let j = 0; j < this.ncol; ++j) {
      for (let i = 0; i < this.nrow - 1; ++i) {
        if (this.position[i][j] === 0) {
          for (let k = j + 1; k < this.nrow; ++k) {
            if (this.position[k][j] !== 0) {
              this.position[i][j] = this.position[k][j];
              this.position[k][j] = 0;
              ret = true;
              break;
            }
          }
        }
      }
    }

    return ret;
  }

  downMove() {
    let ret = false;

    for (let j = 0; j < this.ncol; ++j) {
      for (let i = this.nrow - 1; i > 0; --i) {
        if (this.position[i][j] > 0 && this.position[i][j] === this.position[i - 1][j]) {
          this.position[i][j] = this.position[i][j] * 2;
          this.position[i - 1][j] = 0;
          ret = true;
        }
      }
    }

    for (let j = 0; j < this.ncol; ++j) {
      for (let i = this.nrow - 1; i >= 0; --i) {
        if (this.position[i][j] === 0) {
          for (let k = i - 1; k >= 0; --k) {
            if (this.position[k][j] !== 0) {
              this.position[i][j] = this.position[k][j];
              this.position[k][j] = 0;
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

    let count = 0
    let samplingBoard

    for (let j = 0; j < this.sampling; ++j) {
      samplingBoard = directionBoard.copy()
      for (let k = 0; k < this.depth; ++k) {
        samplingBoard.add()
        if (!samplingBoard.randomMove()) break
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
