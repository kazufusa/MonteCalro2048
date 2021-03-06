import * as assert from 'assert'
import { Board, LEFT, RIGHT, UP, DOWN, DIRECTIONS } from '../lib'

describe('board', () => {
  const initial = [
    [1, 0, 1],
    [0, 1, 2],
    [1, 2, 1],
  ]
  const setup = (options) => new Board(initial, options)

  const left = [
    [2, 0, 0],
    [1, 2, 0],
    [1, 2, 1],
  ]

  const right = [
    [0, 0, 2],
    [0, 1, 2],
    [1, 2, 1],
  ]

  const up = [
    [2, 1, 1],
    [0, 2, 2],
    [0, 0, 1],
  ]

  const down = [
    [0, 0, 1],
    [0, 1, 2],
    [2, 2, 1],
  ]

  const anotherInitial = [[1, 1, 1], [1, 0, 1], [1, 0, 1]]
  const anotherSetup = (options) => new Board(anotherInitial, options)

  const unmovableInitial = [[1, 2, 3], [2, 3, 1], [3, 1, 2]]
  const unmovableSetup = (options) => new Board(unmovableInitial, options)

  describe('.position', () => {
    it('should be equal to the input board setup', () => {
      const board = setup()
      assert.deepStrictEqual(board.position, initial)
    })
  })

  describe('.target', () => {
    it('should be equal to the options.target ', () => {
      const board = setup({ target: 1234 })
      assert.deepStrictEqual(board.target, 1234)
    })
  })

  describe('.isOvered()', () => {
    it('should be false with a setup including a cell of zero', () => {
      const board = setup()
      assert.deepStrictEqual(board.isOvered(), false)
    })

    it('should be true with a setup not including a cell of zero', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.isOvered(), true)
    })
  })

  describe('#isCleared', () => {
    it('should be false with a setup not including target value', () => {
      const board = setup({ target: 2048 })
      assert.deepStrictEqual(board.isCleared(), false)
    })

    it('should be true with a setup including target value', () => {
      const board = setup({ target: 1 })
      assert.deepStrictEqual(board.isCleared(), true)
    })
  })

  describe('#add', () => {
    it('should change a cell\'s value from 0 to 2 or 4', () => {
      const board = new Board([[1, 1], [2, 0]])
      assert.deepStrictEqual(board.position[1][1], 0)
      board.add()
      assert.ok([2, 4].indexOf(board.position[1][1]) >= 0)
    })

    it('should change two cells\' values from 0 to 2 or 4', () => {
      const board = anotherSetup()
      assert.deepStrictEqual(board.position[1][1], 0)
      assert.deepStrictEqual(board.position[2][1], 0)

      board.add()
      board.add()

      assert.ok([2, 4].indexOf(board.position[1][1]) >= 0)
      assert.ok([2, 4].indexOf(board.position[2][1]) >= 0)
    })
  })

  describe('#move', () => {
    it('should be enable to take a move to left', () => {
      const board = setup()
      assert.deepStrictEqual(board.move(LEFT), true)
      assert.deepStrictEqual(board.position, left)
    })

    it('should be enable to take a move to right', () => {
      const board = setup()
      assert.deepStrictEqual(board.move(RIGHT), true)
      assert.deepStrictEqual(board.position, right)
    })

    it('should be enable to take a move to up', () => {
      const board = setup()
      assert.deepStrictEqual(board.move(UP), true)
      assert.deepStrictEqual(board.position, up)
    })

    it('should be enable to take a move to down', () => {
      const board = setup()
      assert.deepStrictEqual(board.move(DOWN), true)
      assert.deepStrictEqual(board.position, down)
    })

    it('should be disable to take a move to left', () => {
      const board = new Board([
        [0, 0, 0],
        [2, 1, 0],
      ])
      assert.deepStrictEqual(board.move(LEFT), false)
    })

    it('should be disable to take a move to right', () => {
      const board = new Board([
        [0, 0, 0],
        [0, 1, 2],
      ])
      assert.deepStrictEqual(board.move(RIGHT), false)
    })

    it('should be disable to take a move to up', () => {
      const board = new Board([
        [32, 16, 256, 2],
        [2, 512, 8, 8],
        [0, 8, 32, 2],
        [0, 2, 1024, 0],
      ]);
      assert.deepStrictEqual(board.move(UP), false)
    })

    it('should be disable to take a move to down', () => {
      const board = new Board([
        [0, 2, 1],
        [0, 1, 2],
      ])
      assert.deepStrictEqual(board.move(DOWN), false)
    })
  })

  describe('#isMovable', () => {
    it('should return being movable to left', () => {
      let board = new Board([
        [0, 0, 0],
        [1, 1, 0],
      ])
      assert.deepStrictEqual(board.isMovable(LEFT), true)
      board = new Board([
        [0, 0, 0],
        [0, 1, 0],
      ])
      assert.deepStrictEqual(board.isMovable(LEFT), true)
    })

    it('should return being movable to right', () => {
      let board = new Board([
        [0, 1, 1],
        [0, 0, 0],
      ])
      assert.deepStrictEqual(board.isMovable(RIGHT), true)
      board = new Board([
        [2, 0, 0],
        [2, 1, 0],
      ])
      assert.deepStrictEqual(board.isMovable(RIGHT), true)
    })

    it('should return being movable to up', () => {
      let board = new Board([
        [2, 0, 0],
        [2, 1, 0],
      ])
      assert.deepStrictEqual(board.isMovable(UP), true)
      board = new Board([
        [0, 0, 0],
        [0, 1, 0],
      ])
      assert.deepStrictEqual(board.isMovable(UP), true)
    })

    it('should return being movable to down', () => {
      let board = new Board([
        [0, 1, 0],
        [0, 1, 0],
      ])
      assert.deepStrictEqual(board.isMovable(DOWN), true)
      board = new Board([
        [0, 1, 0],
        [0, 0, 0],
      ])
      assert.deepStrictEqual(board.isMovable(DOWN), true)
    })

    it('should return being unmovable to left', () => {
      const board = new Board([
        [2, 1, 0],
        [2, 1, 2],
        [0, 0, 0],
      ])
      assert.deepStrictEqual(board.isMovable(LEFT), false)
    })

    it('should return being unmovable to right', () => {
      const board = new Board([
        [1, 2, 1],
        [0, 0, 0],
        [0, 2, 1],
      ])
      assert.deepStrictEqual(board.isMovable(RIGHT), false)
    })

    it('should return being unmovable to up', () => {
      const board = new Board([
        [0, 1, 1],
        [0, 2, 0],
        [0, 1, 0],
      ])
      assert.deepStrictEqual(board.isMovable(UP), false)
    })

    it('should return being unmovable to down', () => {
      const board = new Board([
        [0, 1, 0],
        [0, 2, 0],
        [0, 1, 1],
      ])
      assert.deepStrictEqual(board.isMovable(DOWN), false)
    })
  })

  describe('#evaluate', () => {
    it('returns a evaluation of the input move', () => {
      let board = new Board([
        [32, 16, 256, 2],
        [2, 512, 8, 8],
        [0, 8, 32, 2],
        [0, 2, 1024, 0],
      ]);
      assert.deepStrictEqual(board.evaluate(UP), -1)

      board = new Board([
        [0, 0, 0, 2],
        [0, 0, 2, 4],
        [1, 4, 8, 16],
        [2, 3, 8, 16],
      ])
      assert.ok(parseInt(board.evaluate(UP), 10))
    })
  })

  describe('#estimate', () => {
    it('returns a move and evaluations', () => {
      const board = new Board([[0, 0, 0, 2], [0, 0, 2, 4], [1, 4, 8, 16], [2, 3, 8, 16]])
      const ret = board.estimate()
      assert.ok(DIRECTIONS.indexOf(ret.direction) >= 0)
      assert.deepStrictEqual(ret.evaluations.length, 4)
    })
  })
})
