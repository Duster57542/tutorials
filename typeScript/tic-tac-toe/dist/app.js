var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
var Square = function (_a) {
    var value = _a.value, onSquareClick = _a.onSquareClick, highlight = _a.highlight;
    return (_jsx("button", { className: "square ".concat(highlight ? 'highlight' : ''), onClick: onSquareClick, children: value }));
};
var Board = function (_a) {
    var xIsNext = _a.xIsNext, squares = _a.squares, onPlay = _a.onPlay, winningSquares = _a.winningSquares, isDraw = _a.isDraw;
    var handleClick = function (i) {
        var nextSquares = squares.slice();
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares, i);
    };
    var winner = calculateWinner(squares);
    var status;
    if (winner) {
        status = 'Winner: ' + winner.winner;
    }
    else if (isDraw) {
        status = 'The game is a draw!';
    }
    else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    var renderSquare = function (i) { return (_jsx(Square, { value: squares[i], onSquareClick: function () { return handleClick(i); }, highlight: winningSquares.includes(i) })); };
    var size = 3;
    var boardRows = Array.from({ length: size }).map(function (_, rowIndex) {
        var rowSquares = Array.from({ length: size }).map(function (_, colIndex) {
            var squareIndex = rowIndex * size + colIndex;
            return _jsx("span", { children: renderSquare(squareIndex) }, squareIndex);
        });
        return (_jsx("div", { className: 'board-row', children: rowSquares }, rowIndex));
    });
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: 'status', children: status }), boardRows] }));
};
function calculateWinner(squares) {
    var lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (var i = 0; i < lines.length; i++) {
        var _a = lines[i], a = _a[0], b = _a[1], c = _a[2];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: [a, b, c] };
        }
    }
    return null;
}
var Game = function () {
    var _a = useState([{ squares: Array(9).fill(null), lastMove: null }]), history = _a[0], setHistory = _a[1];
    var _b = useState(0), currentMove = _b[0], setCurrentMove = _b[1];
    var xIsNext = currentMove % 2 === 0;
    var currentSquares = history[currentMove].squares;
    var _c = useState(true), isAscending = _c[0], setIsAscending = _c[1];
    var winnerInfo = calculateWinner(currentSquares);
    var winner = winnerInfo ? winnerInfo.winner : null;
    var winningSquares = winnerInfo ? winnerInfo.line : [];
    var isDraw = currentSquares.every(function (square) { return square !== null; }) && !winner;
    var handlePlay = function (nextSquares, index) {
        var row = Math.floor(index / 3) + 1;
        var col = (index % 3) + 1;
        var nextHistory = history.slice(0, currentMove + 1).concat([
            {
                squares: nextSquares,
                lastMove: "(".concat(row, ", ").concat(col, ")"),
            },
        ]);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    };
    var jumpTo = function (nextMove) {
        setCurrentMove(nextMove);
    };
    var moves = history.map(function (step, move) {
        var desc = move ? "Go to move #".concat(move, " ").concat(step.lastMove) : 'Go to game start';
        var isCurrentMove = move === currentMove;
        return (_jsx("li", { children: isCurrentMove ? (_jsx("span", { children: "You are at move #".concat(move, " ").concat(step.lastMove) })) : (_jsx("button", { onClick: function () { return jumpTo(move); }, children: desc })) }, move));
    });
    var sortedMoves = isAscending ? moves : __spreadArray([], moves, true).reverse();
    return (_jsxs("div", { className: 'game', children: [_jsx("div", { className: 'game-board', children: _jsx(Board, { xIsNext: xIsNext, squares: currentSquares, onPlay: handlePlay, winningSquares: winningSquares, isDraw: isDraw }) }), _jsxs("div", { className: 'game-info', children: [_jsx("button", { onClick: function () { return setIsAscending(!isAscending); }, children: isAscending ? 'Sort Descending' : 'Sort Ascending' }), _jsx("ol", { children: sortedMoves })] })] }));
};
export default Game;
//# sourceMappingURL=app.js.map