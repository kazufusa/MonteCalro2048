(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["montecalro2048"] = factory();
	else
		root["montecalro2048"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UP = 0;
	var RIGHT = 1;
	var DOWN = 2;
	var LEFT = 3;
	var DIRECTIONS = [UP, RIGHT, DOWN, LEFT];

	var copy = function copy(array2d) {
	  var nrow = array2d.length;
	  var ncol = array2d[0].length;
	  var ret = [];
	  for (var i = 0; i < nrow; ++i) {
	    ret[i] = [];
	    for (var j = 0; j < ncol; ++j) {
	      ret[i][j] = array2d[i][j];
	    }
	  }
	  return ret;
	};

	var Board = function () {
	  function Board(setup) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Board);

	    this.position = copy(setup);
	    this.nrow = setup.length;
	    this.ncol = setup[0].length;

	    this.depth = options.depth || 10;
	    this.sampling = options.sampling || 500;
	    this.target = options.target || 2048;

	    this.updateState();
	  }

	  _createClass(Board, [{
	    key: 'updateState',
	    value: function updateState() {
	      this.nEmpty = 0;
	      for (var i = 0; i < this.nrow; ++i) {
	        for (var j = 0; j < this.ncol; ++j) {
	          if (this.position[i][j] === 0) ++this.nEmpty;
	        }
	      }
	    }
	  }, {
	    key: 'isCleared',
	    value: function isCleared() {
	      for (var i = 0; i < this.nrow; ++i) {
	        for (var j = 0; j < this.ncol; ++j) {
	          if (this.position[i][j] === this.target) return true;
	        }
	      }
	      return false;
	    }
	  }, {
	    key: 'isOvered',
	    value: function isOvered() {
	      if (this.nEmpty !== 0) return false;
	      for (var i = 0; i < 4; ++i) {
	        if (this.isMovable(i)) return false;
	      }return true;
	    }
	  }, {
	    key: 'copy',
	    value: function copy() {
	      return new Board(this.position, { depth: this.depth, sampling: this.sampling, target: this.target });
	    }
	  }, {
	    key: 'add',
	    value: function add() {
	      if (this.nEmpty === 0) return;
	      var n = Math.floor(Math.random() * this.nEmpty);

	      for (var i = 0; i < this.nrow; ++i) {
	        for (var j = 0; j < this.ncol; ++j) {
	          if (this.position[i][j] === 0 && n === 0) {
	            this.position[i][j] = Math.random() < 0.9 ? 2 : 4;
	            --this.nEmpty;
	            return;
	          }
	          if (this.position[i][j] === 0) --n;
	        }
	      }
	    }
	  }, {
	    key: 'isLeftMovable',
	    value: function isLeftMovable() {
	      for (var i = 0; i < this.nrow; ++i) {
	        for (var j = 0; j < this.ncol - 1; ++j) {
	          for (var k = j + 1; k < this.ncol; ++k) {
	            if (this.position[i][j] === 0) break;
	            if (this.position[i][j] !== this.position[i][k] && this.position[i][k] !== 0) break;
	            if (this.position[i][j] > 0 && this.position[i][j] === this.position[i][k]) {
	              return true;
	            }
	          }
	        }
	      }

	      for (var _i = 0; _i < this.nrow; ++_i) {
	        for (var _j = 0; _j < this.ncol - 1; ++_j) {
	          if (this.position[_i][_j] === 0) {
	            for (var _k = _j + 1; _k < this.ncol; ++_k) {
	              if (this.position[_i][_k] !== 0) {
	                return true;
	              }
	            }
	          }
	        }
	      }

	      return false;
	    }
	  }, {
	    key: 'isRightMovable',
	    value: function isRightMovable() {
	      for (var i = 0; i < this.nrow; ++i) {
	        for (var j = this.ncol - 1; j > 0; --j) {
	          for (var k = j - 1; k >= 0; --k) {
	            if (this.position[i][j] === 0) break;
	            if (this.position[i][j] !== this.position[i][k] && this.position[i][k] !== 0) break;
	            if (this.position[i][j] > 0 && this.position[i][j] === this.position[i][k]) {
	              return true;
	            }
	          }
	        }
	      }

	      for (var _i2 = 0; _i2 < this.nrow; ++_i2) {
	        for (var _j2 = this.ncol - 1; _j2 >= 0; --_j2) {
	          if (this.position[_i2][_j2] === 0) {
	            for (var _k2 = _j2 - 1; _k2 >= 0; --_k2) {
	              if (this.position[_i2][_k2] !== 0) {
	                return true;
	              }
	            }
	          }
	        }
	      }

	      return false;
	    }
	  }, {
	    key: 'isUpMovable',
	    value: function isUpMovable() {
	      for (var j = 0; j < this.ncol; ++j) {
	        for (var i = 0; i < this.nrow - 1; ++i) {
	          for (var k = i + 1; k < this.nrow; ++k) {
	            if (this.position[i][j] === 0) break;
	            if (this.position[i][j] !== this.position[k][j] && this.position[k][j] !== 0) break;
	            if (this.position[i][j] === this.position[k][j]) {
	              return true;
	            }
	          }
	        }
	      }

	      for (var _j3 = 0; _j3 < this.ncol; ++_j3) {
	        for (var _i3 = 0; _i3 < this.nrow - 1; ++_i3) {
	          if (this.position[_i3][_j3] === 0) {
	            for (var _k3 = _i3 + 1; _k3 < this.nrow; ++_k3) {
	              if (this.position[_k3][_j3] !== 0) {
	                return true;
	              }
	            }
	          }
	        }
	      }

	      return false;
	    }
	  }, {
	    key: 'isDownMovable',
	    value: function isDownMovable() {
	      for (var j = 0; j < this.ncol; ++j) {
	        for (var i = this.nrow - 1; i > 0; --i) {
	          for (var k = i - 1; k >= 0; --k) {
	            if (this.position[i][j] === 0) break;
	            if (this.position[i][j] !== this.position[k][j] && this.position[k][j] !== 0) break;
	            if (this.position[i][j] > 0 && this.position[i][j] === this.position[k][j]) {
	              return true;
	            }
	          }
	        }
	      }

	      for (var _j4 = 0; _j4 < this.ncol; ++_j4) {
	        for (var _i4 = this.nrow - 1; _i4 >= 0; --_i4) {
	          if (this.position[_i4][_j4] === 0) {
	            for (var _k4 = _i4 - 1; _k4 >= 0; --_k4) {
	              if (this.position[_k4][_j4] !== 0) {
	                return true;
	              }
	            }
	          }
	        }
	      }

	      return false;
	    }
	  }, {
	    key: 'isMovable',
	    value: function isMovable(direction) {
	      switch (direction) {
	        case LEFT:
	          return this.isLeftMovable();
	        case RIGHT:
	          return this.isRightMovable();
	        case UP:
	          return this.isUpMovable();
	        case DOWN:
	          return this.isDownMovable();
	        default:
	          return false;
	      }
	    }
	  }, {
	    key: 'randomMove',
	    value: function randomMove() {
	      var directions = [-1, -1, -1, -1];
	      var ndirections = 0;
	      for (var i = 0; i < 4; ++i) {
	        if (this.isMovable(i)) {
	          directions[ndirections] = i;
	          ++ndirections;
	        }
	      }
	      if (ndirections === 0) return false;
	      this.move(directions[Math.floor(Math.random() * ndirections)]);
	      return true;
	    }
	  }, {
	    key: 'move',
	    value: function move(direction) {
	      var ret = void 0;
	      switch (direction) {
	        case LEFT:
	          ret = this.leftMove();
	          break;
	        case RIGHT:
	          ret = this.rightMove();
	          break;
	        case UP:
	          ret = this.upMove();
	          break;
	        case DOWN:
	          ret = this.downMove();
	          break;
	        default:
	          return false;
	      }
	      if (ret) this.updateState();
	      return ret;
	    }
	  }, {
	    key: 'leftMove',
	    value: function leftMove() {
	      var ret = false;

	      for (var i = 0; i < this.nrow; ++i) {
	        for (var j = 0; j < this.ncol - 1; ++j) {
	          for (var k = j + 1; k < this.ncol; ++k) {
	            if (this.position[i][j] === 0) break;
	            if (this.position[i][j] !== this.position[i][k] && this.position[i][k] !== 0) break;
	            if (this.position[i][j] > 0 && this.position[i][j] === this.position[i][k]) {
	              this.position[i][j] = this.position[i][j] * 2;
	              this.position[i][k] = 0;
	              ret = true;
	              break;
	            }
	          }
	        }
	      }

	      for (var _i5 = 0; _i5 < this.nrow; ++_i5) {
	        for (var _j5 = 0; _j5 < this.ncol - 1; ++_j5) {
	          if (this.position[_i5][_j5] === 0) {
	            for (var _k5 = _j5 + 1; _k5 < this.ncol; ++_k5) {
	              if (this.position[_i5][_k5] !== 0) {
	                this.position[_i5][_j5] = this.position[_i5][_k5];
	                this.position[_i5][_k5] = 0;
	                ret = true;
	                break;
	              }
	            }
	          }
	        }
	      }

	      return ret;
	    }
	  }, {
	    key: 'rightMove',
	    value: function rightMove() {
	      var ret = false;

	      for (var i = 0; i < this.nrow; ++i) {
	        for (var j = this.ncol - 1; j > 0; --j) {
	          for (var k = j - 1; k >= 0; --k) {
	            if (this.position[i][j] === 0) break;
	            if (this.position[i][j] !== this.position[i][k] && this.position[i][k] !== 0) break;
	            if (this.position[i][j] > 0 && this.position[i][j] === this.position[i][k]) {
	              this.position[i][j] = this.position[i][j] * 2;
	              this.position[i][k] = 0;
	              ret = true;
	              break;
	            }
	          }
	        }
	      }

	      for (var _i6 = 0; _i6 < this.nrow; ++_i6) {
	        for (var _j6 = this.ncol - 1; _j6 >= 0; --_j6) {
	          if (this.position[_i6][_j6] === 0) {
	            for (var _k6 = _j6 - 1; _k6 >= 0; --_k6) {
	              if (this.position[_i6][_k6] !== 0) {
	                this.position[_i6][_j6] = this.position[_i6][_k6];
	                this.position[_i6][_k6] = 0;
	                ret = true;
	                break;
	              }
	            }
	          }
	        }
	      }

	      return ret;
	    }
	  }, {
	    key: 'upMove',
	    value: function upMove() {
	      var ret = false;

	      for (var j = 0; j < this.ncol; ++j) {
	        for (var i = 0; i < this.nrow - 1; ++i) {
	          for (var k = i + 1; k < this.nrow; ++k) {
	            if (this.position[i][j] === 0) break;
	            if (this.position[i][j] !== this.position[k][j] && this.position[k][j] !== 0) break;
	            if (this.position[i][j] === this.position[k][j]) {
	              this.position[i][j] = this.position[i][j] * 2;
	              this.position[k][j] = 0;
	              ret = true;
	              break;
	            }
	          }
	        }
	      }

	      for (var _j7 = 0; _j7 < this.ncol; ++_j7) {
	        for (var _i7 = 0; _i7 < this.nrow - 1; ++_i7) {
	          if (this.position[_i7][_j7] === 0) {
	            for (var _k7 = _i7 + 1; _k7 < this.nrow; ++_k7) {
	              if (this.position[_k7][_j7] !== 0) {
	                this.position[_i7][_j7] = this.position[_k7][_j7];
	                this.position[_k7][_j7] = 0;
	                ret = true;
	                break;
	              }
	            }
	          }
	        }
	      }

	      return ret;
	    }
	  }, {
	    key: 'downMove',
	    value: function downMove() {
	      var ret = false;

	      for (var j = 0; j < this.ncol; ++j) {
	        for (var i = this.nrow - 1; i > 0; --i) {
	          for (var k = i - 1; k >= 0; --k) {
	            if (this.position[i][j] === 0) break;
	            if (this.position[i][j] !== this.position[k][j] && this.position[k][j] !== 0) break;
	            if (this.position[i][j] > 0 && this.position[i][j] === this.position[k][j]) {
	              this.position[i][j] = this.position[i][j] * 2;
	              this.position[k][j] = 0;
	              ret = true;
	            }
	          }
	        }
	      }

	      for (var _j8 = 0; _j8 < this.ncol; ++_j8) {
	        for (var _i8 = this.nrow - 1; _i8 >= 0; --_i8) {
	          if (this.position[_i8][_j8] === 0) {
	            for (var _k8 = _i8 - 1; _k8 >= 0; --_k8) {
	              if (this.position[_k8][_j8] !== 0) {
	                this.position[_i8][_j8] = this.position[_k8][_j8];
	                this.position[_k8][_j8] = 0;
	                ret = true;
	                break;
	              }
	            }
	          }
	        }
	      }
	      return ret;
	    }
	  }, {
	    key: 'evaluate',
	    value: function evaluate(direction) {
	      var directionBoard = this.copy();
	      if (!directionBoard.move(direction)) return -1;

	      var count = 0;
	      var samplingBoard = void 0;

	      for (var j = 0; j < this.sampling; ++j) {
	        samplingBoard = directionBoard.copy();
	        for (var k = 0; k < this.depth; ++k) {
	          samplingBoard.add();
	          if (!samplingBoard.randomMove()) break;
	        }
	        count += samplingBoard.nEmpty;
	      }

	      return count;
	    }
	  }, {
	    key: 'estimate',
	    value: function estimate() {
	      var _this = this;

	      var evaluations = DIRECTIONS.map(function (v) {
	        return _this.evaluate(v);
	      });
	      return {
	        direction: evaluations.indexOf(Math.max.apply(Math, _toConsumableArray(evaluations))),
	        evaluations: evaluations
	      };
	    }
	  }, {
	    key: 'print',
	    value: function print() {
	      return this.position.map(function (v) {
	        return v.map(function (vv) {
	          return ('    ' + vv).slice(-4);
	        }).join(' ');
	      }).join('\n');
	    }
	  }]);

	  return Board;
	}();

	exports.Board = Board;
	exports.LEFT = LEFT;
	exports.UP = UP;
	exports.RIGHT = RIGHT;
	exports.DOWN = DOWN;
	exports.DIRECTIONS = DIRECTIONS;

/***/ }
/******/ ])
});
;