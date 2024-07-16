import React, { useState } from 'react'

function calculateWinner(squares: Array<string | undefined>): WinnerInfo | undefined {
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
	return lines
		.map((line) => {
			const [a, b, c] = line
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return { winner: squares[a], line: [a, b, c] }
			}
			return undefined
		})
		.find((result) => result !== undefined)
}

interface SquareProps {
	value: string | undefined
	onSquareClick: () => void
	highlight: boolean
}

const Square: React.FC<SquareProps> = ({ value, onSquareClick, highlight }) => (
	<button type='button' className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
		{value}
	</button>
)

interface BoardProps {
	xIsNext: boolean
	squares: Array<string | undefined>
	onPlay: (nextSquares: Array<string | undefined>, index: number) => void
	winningSquares: number[]
	isDraw: boolean
}

const Board: React.FC<BoardProps> = ({ xIsNext, squares, onPlay, winningSquares, isDraw }) => {
	const handleClick = (i: number) => {
		const nextSquares = [...squares]
		if (squares[i] || calculateWinner(squares)) {
			return
		}
		nextSquares[i] = xIsNext ? 'X' : 'O'
		onPlay(nextSquares, i)
	}

	const winner = calculateWinner(squares)
	let status: string
	if (winner) {
		status = `Winner: ${winner.winner}`
	} else if (isDraw) {
		status = 'The game is a draw!'
	} else {
		status = `Next player: ${xIsNext ? 'X' : 'O'}`
	}

	const renderSquare = (i: number) => <Square value={squares[i] ?? undefined} onSquareClick={() => handleClick(i)} highlight={winningSquares.includes(i)} />

	const size = 3
	const boardRows = Array.from({ length: size }).map((_, rowIndex) => {
		const rowSquares = Array.from({ length: size }).map((__, colIndex) => {
			const squareIndex = rowIndex * size + colIndex
			return <span key={squareIndex}>{renderSquare(squareIndex)}</span>
		})
		// Use squareIndex of the first square in each row as the key for the row
		const rowKey = rowIndex * size
		return (
			<div className='board-row' key={rowKey}>
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

interface WinnerInfo {
	winner: string
	line: number[]
}

const Game: React.FC = () => {
	const [history, setHistory] = useState([{ squares: Array(9).fill(undefined), lastMove: undefined as string | undefined }])
	const [currentMove, setCurrentMove] = useState(0)
	const xIsNext = currentMove % 2 === 0
	const currentSquares = history[currentMove].squares
	const [isAscending, setIsAscending] = useState(true)

	const winnerInfo = calculateWinner(currentSquares)
	const winner = winnerInfo ? winnerInfo.winner : undefined
	const winningSquares = winnerInfo ? winnerInfo.line : []

	const isDraw = currentSquares.every((square) => square !== null) && !winner

	const handlePlay = (nextSquares: Array<string | undefined>, index: number) => {
		const row = Math.floor(index / 3) + 1
		const col = (index % 3) + 1

		const nextHistory = [
			...history.slice(0, currentMove + 1),
			{
				squares: nextSquares,
				lastMove: `(${row}, ${col})`,
			},
		]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	const jumpTo = (nextMove: number) => {
		setCurrentMove(nextMove)
	}

	const moves = history.map((step, move) => {
		// Provide a default description for the last move if it's undefined
		const lastMoveDescription = step.lastMove || 'Unknown move'
		const desc = move ? `Go to move #${move} ${lastMoveDescription}` : 'Go to game start'
		const isCurrentMove = move === currentMove
		// Handle undefined step.lastMove by using a default value for key generation
		const key = `move-${move}-${lastMoveDescription.replaceAll(' ', '')}`
		return (
			<li key={key}>
				{isCurrentMove ? (
					<span>{`You are at move #${move} ${lastMoveDescription}`}</span>
				) : (
					<button type='button' onClick={() => jumpTo(move)}>
						{desc}
					</button>
				)}
			</li>
		)
	})

	const sortedMoves = isAscending ? moves : [...moves].reverse()

	return (
		<div className='game'>
			<div className='game-board'>
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} isDraw={isDraw} />
			</div>
			<div className='game-info'>
				<button type='button' onClick={() => setIsAscending(!isAscending)}>
					{isAscending ? 'Sort Descending' : 'Sort Ascending'}
				</button>
				<ol>{sortedMoves}</ol>
			</div>
		</div>
	)
}

export default Game
