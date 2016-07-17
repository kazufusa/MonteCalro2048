# montecalro2048: 2048 Solver using Monte Calro Simulation

[![Build Status](https://travis-ci.org/kazufusa/MonteCalro2048.svg)](https://travis-ci.org/kazufusa/MonteCalro2048)

montecalro2048 is a simple Monte Calro solver for
2048 game [2048 game](https://github.com/gabrielecirulli/2048).

```javascript
var Board = require("montecalro2048").Board;
var board = new Board([
  [  2,  16,   8,  0],
  [  0,  64, 125, 16],
  [ 32, 512,   8,  4],
  [  8,   2,  64, 16]
]);
var bestmove = board.estimate().direction // 0:LEFT, 1:RIGHT, 2:UP, 3:DOWN
```

## Class: Board

`Board` is a sampler of 2048 game.

### `new Board(setup, [options])`

* `setup` 2D Array - Setup of the game.
* `options` Object
  * `target` Integer - Target value of the game. Default is `2048`.
  * `depth` Integer - The samling depth. Default is `10`.
  * `sampling` Integer - The samling size for all valid moves. Default is `500`.

### Instance Methods

The `Board` class has the following methods:

#### `board.estimate()`

Returns a `estimation`.

* `estimation` Object
  * `direction` Integer - Estimated move(0: left, 1: right, 2: up, 3: down).
  * `evaluation` Integer - The evaluations of all moves.

#### `board.add()`

A new tile will randomly appear in an empty(=0) spot on the board with a value of either 2 or 4.

#### `board.move(direction)`

* `direction` Integer - Move the board to the input direction (0: left, 1: right, 2: up, 3: down).

#### `board.print()`

* `position` String - String of urrent position.

## example

### auto play

```javascript
var Board = require(montecalro2048).Board;
var board = new Board([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]);

while (!board.isOvered() && !board.isCleared()) {
  console.log(board.print());
  console.log()
  board.add();
  console.log(board.print());
  console.log()
  board.move(board.estimate().direction);
};
console.log(board.print());
console.log()
```
