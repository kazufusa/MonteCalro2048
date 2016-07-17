var Board = require('../lib').Board;
var process = require('process');

var board = new Board([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
while (!board.isOvered() && !board.isCleared()) {
  console.log(board.print())
  console.log()
  board.add();
  console.log(board.print())
  console.log()
  board.move(board.estimate().direction);
};
console.log(board.print())
console.log()
process.exit(board.isCleared ? 0 : 1);
