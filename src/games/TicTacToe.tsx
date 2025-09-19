import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

type Player = 'X' | 'O'
type CellValue = Player | null
type BoardState = CellValue[]

type WinnerResult = {
  winner: Player | null
  line: number[]
}

const panelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  padding: '1.5rem',
  borderRadius: '1.5rem',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  background:
    'linear-gradient(145deg, rgba(18, 0, 50, 0.95), rgba(60, 0, 110, 0.78))',
  boxShadow:
    '0 30px 60px rgba(0, 0, 0, 0.35), inset 0 0 40px rgba(255, 82, 190, 0.2)',
} satisfies CSSProperties

const statusStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '0.9rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
} satisfies CSSProperties

const statusHighlightStyle = {
  padding: '0.45rem 0.75rem',
  borderRadius: '0.75rem',
  backgroundColor: 'rgba(255, 82, 190, 0.16)',
  color: '#ff7ad9',
  fontSize: '0.85rem',
  letterSpacing: '0.18em',
} satisfies CSSProperties

const boardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(60px, 1fr))',
  gap: '0.8rem',
} satisfies CSSProperties

const squareStyle = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.8rem 0',
  borderRadius: '1rem',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backgroundColor: 'rgba(11, 0, 36, 0.85)',
  color: '#f9f7ff',
  fontSize: '1.75rem',
  fontFamily: '"Press Start 2P", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
} satisfies CSSProperties

const squareDisabledStyle = {
  ...squareStyle,
  cursor: 'not-allowed',
  color: 'rgba(255, 255, 255, 0.45)',
  borderColor: 'rgba(255, 255, 255, 0.08)',
} satisfies CSSProperties

const resetButtonStyle = {
  alignSelf: 'flex-end',
  padding: '0.85rem 1.4rem',
  borderRadius: '0.9rem',
  border: '1px solid rgba(255, 82, 190, 0.6)',
  background:
    'linear-gradient(135deg, rgba(255, 82, 190, 0.25), rgba(120, 0, 255, 0.35))',
  color: '#ffe9fb',
  fontSize: '0.75rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
} satisfies CSSProperties

const winningSquareStyle = {
  boxShadow: '0 0 25px rgba(255, 82, 190, 0.65), inset 0 0 15px rgba(255, 82, 190, 0.35)',
  borderColor: 'rgba(255, 255, 255, 0.5)',
} satisfies CSSProperties

const createEmptyBoard = (): BoardState => Array.from({ length: 9 }, () => null)

const calculateWinner = (board: BoardState): WinnerResult => {
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

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }
    }
  }

  return { winner: null, line: [] }
}

const getAvailableMoves = (board: BoardState): number[] =>
  board.reduce<number[]>((moves, cell, index) => {
    if (!cell) {
      moves.push(index)
    }

    return moves
  }, [])

const minimax = (board: BoardState, depth: number, isMaximizing: boolean): number => {
  const { winner } = calculateWinner(board)

  if (winner === 'O') {
    return 10 - depth
  }

  if (winner === 'X') {
    return depth - 10
  }

  if (board.every((cell) => cell !== null)) {
    return 0
  }

  if (isMaximizing) {
    let bestScore = -Infinity

    for (const move of getAvailableMoves(board)) {
      const nextBoard = board.slice() as BoardState
      nextBoard[move] = 'O'
      const score = minimax(nextBoard, depth + 1, false)
      bestScore = Math.max(bestScore, score)
    }

    return bestScore
  }

  let bestScore = Infinity

  for (const move of getAvailableMoves(board)) {
    const nextBoard = board.slice() as BoardState
    nextBoard[move] = 'X'
    const score = minimax(nextBoard, depth + 1, true)
    bestScore = Math.min(bestScore, score)
  }

  return bestScore
}

const getBestMove = (board: BoardState): number | null => {
  let bestScore = -Infinity
  let bestMove: number | null = null

  for (const move of getAvailableMoves(board)) {
    const nextBoard = board.slice() as BoardState
    nextBoard[move] = 'O'
    const score = minimax(nextBoard, 0, false)

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

const TicTacToe = () => {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard())
  const [isXNext, setIsXNext] = useState(true)
  const [isComputerThinking, setIsComputerThinking] = useState(false)

  const { winner, line } = useMemo(() => calculateWinner(board), [board])
  const isBoardFull = board.every((cell) => cell !== null)
  const isPlayerTurn = isXNext && !winner && !isBoardFull

  const status = winner
    ? winner === 'X'
      ? 'Victory: You (X)'
      : 'Defeat: Neon AI (O)'
    : isBoardFull
      ? 'Stalemate'
      : isXNext
        ? 'Your move (X)'
        : 'Neon AI calculating…'

  useEffect(() => {
    if (!isXNext && !winner && !isBoardFull) {
      setIsComputerThinking(true)

      const timer = window.setTimeout(() => {
        const move = getBestMove(board)

        if (move !== null) {
          setBoard((prevBoard) => {
            if (prevBoard[move]) {
              return prevBoard
            }

            const nextBoard = prevBoard.slice() as BoardState
            nextBoard[move] = 'O'
            return nextBoard
          })
        }

        setIsXNext(true)
        setIsComputerThinking(false)
      }, 400)

      return () => {
        window.clearTimeout(timer)
      }
    }

    if (isComputerThinking) {
      setIsComputerThinking(false)
    }
  }, [board, isBoardFull, isComputerThinking, isXNext, winner])

  const handleSquareClick = (index: number) => {
    if (!isPlayerTurn || board[index] || winner) {
      return
    }

    setBoard((prevBoard) => {
      if (prevBoard[index]) {
        return prevBoard
      }

      const nextBoard = prevBoard.slice() as BoardState
      nextBoard[index] = 'X'
      return nextBoard
    })
    setIsXNext(false)
  }

  const handleReset = () => {
    setBoard(createEmptyBoard())
    setIsXNext(true)
    setIsComputerThinking(false)
  }

  return (
    <div style={panelStyle}>
      <div style={statusStyle}>
        <span>Neon Grid</span>
        <span style={statusHighlightStyle}>{status}</span>
      </div>
      <div style={boardStyle}>
        {board.map((value, index) => {
          const isWinningSquare = line.includes(index)
          const canInteract = isPlayerTurn && !value
          const style: CSSProperties = isWinningSquare
            ? { ...squareDisabledStyle, ...winningSquareStyle }
            : canInteract
              ? squareStyle
              : squareDisabledStyle

          return (
            <button
              key={index}
              style={style}
              type="button"
              onClick={() => handleSquareClick(index)}
              disabled={!canInteract}
              aria-label={`Grid square ${index + 1}${value ? `, currently ${value}` : ''}`}
            >
              {value ?? '\u00a0'}
            </button>
          )
        })}
      </div>
      <button style={resetButtonStyle} type="button" onClick={handleReset} disabled={isComputerThinking}>
        Reset Round
      </button>
    </div>
  )
}

export default TicTacToe
