"use strict";
exports.__esModule = true;
exports.COLS = 10;
exports.ROWS = 20;
exports.BLOCK_SIZE = 30;
var LINES_PER_LEVEL = 10;
exports.COLORS = [
    'none',
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
];
exports.SHAPES = [
    [],
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
    [[4, 4], [4, 4]],
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];
exports.LEVEL = {
    0: 800,
    1: 720,
    2: 630,
    3: 550,
    4: 470,
    5: 380,
    6: 300,
    7: 220,
    8: 130,
    9: 100,
    10: 80,
    11: 80,
    12: 80,
    13: 70,
    14: 70,
    15: 70,
    16: 50,
    17: 50,
    18: 50,
    19: 30,
    20: 30
};
var KEY;
(function (KEY) {
    KEY[KEY["ESC"] = 27] = "ESC";
    KEY[KEY["SPACE"] = 32] = "SPACE";
    KEY[KEY["LEFT"] = 37] = "LEFT";
    KEY[KEY["UP"] = 38] = "UP";
    KEY[KEY["RIGHT"] = 39] = "RIGHT";
    KEY[KEY["DOWN"] = 40] = "DOWN";
    KEY[KEY["P"] = 80] = "P";
})(KEY = exports.KEY || (exports.KEY = {}));
var POINTS;
(function (POINTS) {
    POINTS[POINTS["SINGLE"] = 100] = "SINGLE";
    POINTS[POINTS["DOUBLE"] = 300] = "DOUBLE";
    POINTS[POINTS["TRIPLE"] = 500] = "TRIPLE";
    POINTS[POINTS["TETRIS"] = 800] = "TETRIS";
    POINTS[POINTS["SOFT_DROP"] = 1] = "SOFT_DROP";
    POINTS[POINTS["HARD_DROP"] = 2] = "HARD_DROP";
})(POINTS = exports.POINTS || (exports.POINTS = {}));
