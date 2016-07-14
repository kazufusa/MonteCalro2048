var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

var Board = require('../lib').Board;
var board = new Board([[0, 0, 0, 0], [0, 0, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);

suite
.add('Board#predict', function(){
  board.predict();
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({ 'async': true });
