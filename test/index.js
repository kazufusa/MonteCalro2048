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

  describe('.isCleared', () => {
    it('should be false with a setup not including target value', () => {
      const board = setup({ target: 2048 })
      assert.ok(!board.isCleared)
    })

    it('should be true with a setup including target value', () => {
      const board = setup({ target: 2 })
      assert.ok(board.isCleared)
    })
  })

  describe('.isOvered', () => {
    it('should be false with a setup including a cell of zero', () => {
      const board = setup()
      assert.ok(!board.isOvered)
    })

    it('should be true with a setup not including a cell of zero', () => {
      const board = unmovableSetup()
      assert.ok(board.isOvered)
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
      board.move(LEFT)
      assert.deepStrictEqual(board.position, left)
    })

    it('should be enable to take a move to right', () => {
      const board = setup()
      board.move(RIGHT)
      assert.deepStrictEqual(board.position, right)
    })

    it('should be enable to take a move to up', () => {
      const board = setup()
      board.move(UP)
      assert.deepStrictEqual(board.position, up)
    })

    it('should be enable to take a move to down', () => {
      const board = setup()
      board.move(DOWN)
      assert.deepStrictEqual(board.position, down)
    })

    it('should be disable to take a move to left', () => {
      const board = unmovableSetup()
      assert.ok(!board.move(DOWN))
      assert.ok(board.isOvered)
    })

    it('should be disable to take a move to right', () => {
      const board = unmovableSetup()
      assert.ok(!board.move(RIGHT))
      assert.ok(board.isOvered)
    })

    it('should be disable to take a move to up', () => {
      const board = unmovableSetup()
      assert.ok(!board.move(UP))
      assert.ok(board.isOvered)
    })

    it('should be disable to take a move to down', () => {
      const board = unmovableSetup()
      assert.ok(!board.move(DOWN))
      assert.ok(board.isOvered)
    })
  })

  describe('#evaluate', () => {
    it('returns a evaluation of the input move', () => {
      const board = new Board([[0, 0, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])
      assert.ok(parseInt(board.evaluate(), 10))
    })
  })

  describe('#predict', () => {
    it('returns a move and evaluations', () => {
      const board = new Board([[0, 0, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])
      const ret = board.predict()
      assert.ok(DIRECTIONS.includes(ret.direction))
      assert.deepStrictEqual(ret.evaluations.length, 4)
    })
  })
})
