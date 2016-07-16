import * as assert from 'assert'
import { Board, LEFT, RIGHT, UP, DOWN, DIRECTIONS } from '../lib'

describe('board', () => {
  // 0 2 2
  // 2 2 4
  // 4 4 4
  const initial = [[0, 2, 2], [2, 2, 4], [4, 4, 4]]
  const setup = (options) => new Board(initial, options)

  // 4 0 0
  // 4 4 0
  // 8 4 0
  const left = [[4, 0, 0], [4, 4, 0], [8, 4, 0]]

  // 0 0 4
  // 0 4 4
  // 0 4 8
  const right = [[0, 0, 4], [0, 4, 4], [0, 4, 8]]

  // 2 4 2
  // 4 4 8
  // 0 0 0
  const up = [[2, 4, 2], [4, 4, 8], [0, 0, 0]]

  // 0 0 0
  // 2 4 2
  // 4 4 8
  const down = [[0, 0, 0], [2, 4, 2], [4, 4, 8]]

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

  describe('.isOvered', () => {
    it('should be false with a setup including a cell of zero', () => {
      const board = setup()
      assert.deepStrictEqual(board.isOvered, false)
    })

    it('should be true with a setup not including a cell of zero', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.isOvered, true)
    })
  })

  describe('#isCleared', () => {
    it('should be false with a setup not including target value', () => {
      const board = setup({ target: 2048 })
      assert.deepStrictEqual(board.isCleared(), false)
    })

    it('should be true with a setup including target value', () => {
      const board = setup({ target: 2 })
      assert.deepStrictEqual(board.isCleared(), true)
    })
  })

  describe('#add', () => {
    it('should change a cell\'s value from 0 to 2 or 4', () => {
      const board = setup()
      assert.deepStrictEqual(board.position[0][0], 0)
      board.add()
      assert.ok([2, 4].includes(board.position[0][0]))
    })

    it('should change two cells\' values from 0 to 2 or 4', () => {
      const board = anotherSetup()
      assert.deepStrictEqual(board.position[1][1], 0)
      assert.deepStrictEqual(board.position[2][1], 0)

      board.add()
      board.add()

      assert.ok([2, 4].includes(board.position[1][1]))
      assert.ok([2, 4].includes(board.position[2][1]))
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
      const board = unmovableSetup()
      assert.deepStrictEqual(board.move(DOWN), false)
      assert.deepStrictEqual(board.isOvered, true)
    })

    it('should be disable to take a move to right', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.move(RIGHT), false)
      assert.deepStrictEqual(board.isOvered, true)
    })

    it('should be disable to take a move to up', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.move(UP), false)
      assert.deepStrictEqual(board.isOvered, true)
    })

    it('should be disable to take a move to down', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.move(DOWN), false)
      assert.deepStrictEqual(board.isOvered, true)
    })
  })

  describe('#isMovable', () => {
    it('should return being movable to left', () => {
      const board = setup()
      assert.deepStrictEqual(board.isMovable(LEFT), true)
    })

    it('should return being movable to right', () => {
      const board = setup()
      assert.deepStrictEqual(board.isMovable(RIGHT), true)
    })

    it('should return being movable to up', () => {
      const board = setup()
      assert.deepStrictEqual(board.isMovable(UP), true)
    })

    it('should return being movable to down', () => {
      const board = setup()
      assert.deepStrictEqual(board.isMovable(DOWN), true)
    })

    it('should return being unmovable to left', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.isMovable(LEFT), false)
    })

    it('should return being unmovable to right', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.isMovable(RIGHT), false)
    })

    it('should return being unmovable to up', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.isMovable(UP), false)
    })

    it('should return being unmovable to down', () => {
      const board = unmovableSetup()
      assert.deepStrictEqual(board.isMovable(DOWN), false)
    })
  })

  describe('#evaluate', () => {
    it('returns a evaluation of the input move', () => {
      const board = new Board([[0, 0, 0, 2], [0, 0, 2, 4], [1, 4, 8, 16], [2, 3, 8, 16]])
      assert.ok(parseInt(board.evaluate(0), 10))
    })
  })

  describe('#predict', () => {
    it('returns a move and evaluations', () => {
      const board = new Board([[0, 0, 0, 2], [0, 0, 2, 4], [1, 4, 8, 16], [2, 3, 8, 16]])
      const ret = board.predict()
      assert.ok(DIRECTIONS.includes(ret.direction))
      assert.deepStrictEqual(ret.evaluations.length, 4)
    })
  })
})
