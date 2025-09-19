import { useMemo, useState } from 'react'

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
}

const statusStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '0.9rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

const statusHighlightStyle = {
  padding: '0.45rem 0.75rem',
  borderRadius: '0.75rem',
  backgroundColor: 'rgba(255, 82, 190, 0.16)',
  color: '#ff7ad9',
  fontSize: '0.85rem',
  letterSpacing: '0.18em',
}

const boardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(60px, 1fr))',
  gap: '0.8rem',
}

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
}

const squareDisabledStyle = {
  ...squareStyle,
  cursor: 'not-allowed',
  color: 'rgba(255, 255, 255, 0.45)',
  borderColor: 'rgba(255, 255, 255, 0.08)',
}

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
}

const winningSquareStyle = {
  boxShadow: '0 0 25px rgba(255, 82, 190, 0.65), inset 0 0 15px rgba(255, 82, 190, 0.35)',
  borderColor: 'rgba(255, 255, 255, 0.5)',
}

const calculateWinner = (board) => {
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

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)

  const { winner, line } = useMemo(() => calculateWinner(board), [board])
  const isBoardFull = board.every((cell) => cell !== null)

  const status = winner
    ? `Victory: ${winner}`
    : isBoardFull
      ? 'Stalemate'
      : `Next move: ${isXNext ? 'X' : 'O'}`

  const handleSquareClick = (index) => {
    if (board[index] || winner) {
      return
    }

    const nextBoard = board.slice()
    nextBoard[index] = isXNext ? 'X' : 'O'

    setBoard(nextBoard)
    setIsXNext((prev) => !prev)
  }

  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

  return (
    <div style={panelStyle}>
      <div style={statusStyle}>
        <span>Neon Grid</span>
        <span style={statusHighlightStyle}>{status}</span>
      </div>
      <div style={boardStyle}>
        {board.map((value, index) => {
          const isDisabled = Boolean(value) || Boolean(winner)
          const style = line.includes(index)
            ? { ...squareDisabledStyle, ...winningSquareStyle }
            : isDisabled
              ? squareDisabledStyle
              : squareStyle

          return (
            <button
              key={index}
              style={style}
              type="button"
              onClick={() => handleSquareClick(index)}
              aria-label={`Grid square ${index + 1}${value ? `, currently ${value}` : ''}`}
            >
              {value || '\u00a0'}
            </button>
          )
        })}
      </div>
      <button style={resetButtonStyle} type="button" onClick={handleReset}>
        Reset Round
      </button>
    </div>
  )
}

export default TicTacToe
