var Board = require('../lib').Board;
var process = require('process');

var board = new Board([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
while (!board.isOvered && !board.isCleared) {
  board.add();
  board.move(board.predict().direction);
};
process.exit(board.isCleared ? 0 : 1);
