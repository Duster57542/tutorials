import { useState } from 'react'

function Square({ value, onSquareClick, highlight }) {
	return (
		<button
			className={`square ${highlight ? 'highlight' : ''}`} // Conditionally add highlight class
			onClick={onSquareClick}
		>
			{value}
		</button>
	)
}

function Board({ xIsNext, squares, onPlay, winningSquares, isDraw }) {
	function handleClick(i) {
		const nextSquares = squares.slice()
		if (squares[i] || calculateWinner(squares)) {
			return
		}
		nextSquares[i] = xIsNext ? 'X' : 'O'
		onPlay(nextSquares, i) // Pass the index to onPlay
	}

	const winner = calculateWinner(squares)
	let status
	if (winner) {
		status = 'Winner: ' + winner.winner
	} else if (isDraw) {
		status = 'The game is a draw!'
	} else {
		status = 'Next player: ' + (xIsNext ? 'X' : 'O')
	}

	const renderSquare = (i) => (
		<Square
			value={squares[i]}
			onSquareClick={() => handleClick(i)}
			highlight={winningSquares.includes(i)} // Add highlight prop based on winningSquares
		/>
	)

	const size = 3 // Assuming a 3x3 board
	const boardRows = Array.from({ length: size }).map((_, rowIndex) => {
		const rowSquares = Array.from({ length: size }).map((_, colIndex) => {
			const squareIndex = rowIndex * size + colIndex
			return <span key={squareIndex}>{renderSquare(squareIndex)}</span>
		})

		return (
			<div className='board-row' key={rowIndex}>
				{rowSquares}
			</div>
		)
	})

	return (
		<>
			<div className='status'>{status}</div>
			{boardRows}
		</>
	)
}

export default function Game() {
	const [history, setHistory] = useState([{ squares: Array(9).fill(null), lastMove: null }])
	const [currentMove, setCurrentMove] = useState(0)
	const xIsNext = currentMove % 2 === 0
	const currentSquares = history[currentMove].squares
	const [isAscending, setIsAscending] = useState(true)

	const winnerInfo = calculateWinner(currentSquares) // Assume this now returns { winner, line } or null
	const winner = winnerInfo ? winnerInfo.winner : null
	const winningSquares = winnerInfo ? winnerInfo.line : []

	// Check for a draw
	const isDraw = currentSquares.every((square) => square !== null) && !winner

	function toggleSortOrder() {
		setIsAscending(!isAscending)
	}

	function handlePlay(nextSquares, index) {
		const row = Math.floor(index / 3) + 1
		const col = (index % 3) + 1

		const nextHistory = history.slice(0, currentMove + 1).concat([
			{
				squares: nextSquares,
				lastMove: `(${row}, ${col})`,
			},
		])
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove)
	}

	const moves = history.map((step, move) => {
		const desc = move ? `Go to move #${move} ${step.lastMove}` : 'Go to game start'
		const isCurrentMove = move === currentMove
		return <li key={move}>{isCurrentMove ? <span>{`You are at move #${move} ${step.lastMove}`}</span> : <button onClick={() => jumpTo(move)}>{desc}</button>}</li>
	})

	// Adjust the rendering of moves
	const sortedMoves = isAscending ? moves : [...moves].reverse()

	return (
		<div className='game'>
			<div className='game-board'>
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={(nextSquares, index) => handlePlay(nextSquares, index)} winningSquares={winningSquares} isDraw={isDraw} />
			</div>
			<div className='game-info'>
				<button onClick={toggleSortOrder}>{isAscending ? 'Sort Descending' : 'Sort Ascending'}</button>
				<ol>{sortedMoves}</ol>
			</div>
		</div>
	)
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { winner: squares[a], line: [a, b, c] }
		}
	}
	return null
}
