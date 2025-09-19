import { useEffect, useMemo, useRef, useState } from 'react'

const GRID_SIZE = 18
const BASE_SPEED = 160
const SPEED_STEP = 6
const MIN_SPEED = 80

const emojiStyle = {
  fontSize: '1.1rem',
  lineHeight: 1,
  filter: 'drop-shadow(0 2px 6px rgba(255, 189, 255, 0.5))',
}

const boardWrapperStyle = {
  position: 'relative',
  borderRadius: '1.5rem',
  padding: '1.25rem',
  background: 'linear-gradient(145deg, rgba(23, 0, 55, 0.85), rgba(72, 0, 118, 0.65))',
  boxShadow: 'inset 0 0 30px rgba(255, 45, 149, 0.35)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
}

const boardStyle = {
  display: 'grid',
  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
  gap: '4px',
  width: '100%',
  aspectRatio: '1 / 1',
  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.06) 0%, rgba(12, 0, 35, 0.9) 100%)',
  padding: '0.85rem',
  borderRadius: '1.15rem',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 25px rgba(255, 0, 149, 0.25)',
}

const cellStyle = {
  position: 'relative',
  borderRadius: '0.6rem',
  background: 'rgba(12, 0, 35, 0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 6px 12px rgba(8, 0, 35, 0.4)',
}

const hudStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.85rem',
  fontFamily: '"Press Start 2P", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '0.7rem',
  letterSpacing: '0.12em',
  color: 'rgba(255, 255, 255, 0.82)',
}

const controlsStyle = {
  marginTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const buttonRowStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.75rem',
}

const controlButtonStyle = {
  background: 'rgba(255, 45, 149, 0.14)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  color: '#f9f7ff',
  fontFamily: '"Press Start 2P", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  letterSpacing: '0.08em',
  padding: '0.65rem 1.25rem',
  borderRadius: '0.9rem',
  fontSize: '0.6rem',
  cursor: 'pointer',
  transition: 'transform 0.15s ease, background 0.15s ease',
}

const directionPadStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '0.5rem',
  width: 'min(220px, 100%)',
  margin: '0 auto',
}

const directionButtonStyle = {
  background: 'rgba(71, 0, 183, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '0.9rem',
  padding: '0.65rem 0',
  color: '#f9f7ff',
  fontSize: '0.75rem',
  letterSpacing: '0.08em',
  cursor: 'pointer',
  transition: 'background 0.15s ease, transform 0.15s ease',
}

const centerPadStyle = {
  visibility: 'hidden',
}

const messageStyle = {
  textAlign: 'center',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '0.78rem',
  letterSpacing: '0.04em',
  color: 'rgba(229, 224, 255, 0.78)',
  lineHeight: 1.6,
}

const SmileSnakeGame = () => {
  const [gameState, setGameState] = useState(() => createInitialState())
  const [highScore, setHighScore] = useState(0)
  const directionRef = useRef({ x: 1, y: 0 })
  const currentDirectionRef = useRef({ x: 1, y: 0 })

  useEffect(() => {
    if (gameState.status !== 'running') {
      return undefined
    }

    let animationFrameId
    let lastFrameTime = performance.now()

    const tick = (time) => {
      if (time - lastFrameTime >= gameState.speed) {
        lastFrameTime = time
        setGameState((prev) => {
          if (prev.status !== 'running') {
            return prev
          }

          const nextDirection = directionRef.current
          const newHead = {
            x: prev.snake[0].x + nextDirection.x,
            y: prev.snake[0].y + nextDirection.y,
          }

          currentDirectionRef.current = nextDirection

          if (isCollision(newHead, prev.snake)) {
            return {
              ...prev,
              status: 'gameOver',
            }
          }

          const updatedSnake = [newHead, ...prev.snake]
          let updatedApple = prev.apple
          let updatedScore = prev.score
          let updatedSpeed = prev.speed

          if (newHead.x === prev.apple.x && newHead.y === prev.apple.y) {
            updatedScore += 1
            updatedApple = generateApple(updatedSnake)
            updatedSpeed = Math.max(MIN_SPEED, prev.speed - SPEED_STEP)
          } else {
            updatedSnake.pop()
          }

          return {
            ...prev,
            snake: updatedSnake,
            apple: updatedApple,
            score: updatedScore,
            speed: updatedSpeed,
          }
        })
      }

      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animationFrameId)
  }, [gameState.status, gameState.speed])

  useEffect(() => {
    if (gameState.status === 'gameOver') {
      setHighScore((previousHigh) => Math.max(previousHigh, gameState.score))
    }
  }, [gameState.status, gameState.score])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key
      const isArrow = key.startsWith('Arrow')
      const normalizedKey = isArrow ? key.slice(5).toLowerCase() : key.toLowerCase()

      if (['up', 'down', 'left', 'right', 'w', 'a', 's', 'd'].includes(normalizedKey)) {
        event.preventDefault()
        changeDirection(normalizedKey)
        return
      }

      if (key === ' ' || key === 'Enter') {
        event.preventDefault()
        controlGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const changeDirection = (key) => {
    const normalized = normalizeDirectionKey(key)
    if (!normalized) {
      return
    }

    const { x, y } = currentDirectionRef.current

    switch (normalized) {
      case 'up':
        if (y !== 0) return
        directionRef.current = { x: 0, y: -1 }
        break
      case 'down':
        if (y !== 0) return
        directionRef.current = { x: 0, y: 1 }
        break
      case 'left':
        if (x !== 0) return
        directionRef.current = { x: -1, y: 0 }
        break
      case 'right':
        if (x !== 0) return
        directionRef.current = { x: 1, y: 0 }
        break
      default:
        break
    }
  }

  const controlGame = () => {
    setGameState((prev) => {
      if (prev.status === 'running') {
        return { ...prev, status: 'paused' }
      }

      if (prev.status === 'paused') {
        return { ...prev, status: 'running' }
      }

      const nextState = {
        ...createInitialState(),
        status: 'running',
      }
      directionRef.current = { x: 1, y: 0 }
      currentDirectionRef.current = { x: 1, y: 0 }
      return nextState
    })
  }

  const handleStartClick = () => {
    if (gameState.status === 'running' || gameState.status === 'paused') {
      controlGame()
      return
    }

    directionRef.current = { x: 1, y: 0 }
    currentDirectionRef.current = { x: 1, y: 0 }
    setGameState({ ...createInitialState(), status: 'running' })
  }

  const handleDirectionButton = (direction) => {
    changeDirection(direction)
  }

  const resetGame = () => {
    directionRef.current = { x: 1, y: 0 }
    currentDirectionRef.current = { x: 1, y: 0 }
    setGameState(createInitialState())
  }

  const statusMessage = useMemo(() => {
    switch (gameState.status) {
      case 'idle':
        return 'Press space or tap Start to wake the smiley serpent.'
      case 'paused':
        return 'Game paused. Stretch those fingers and press start to keep slithering.'
      case 'gameOver':
        return 'Game over! Tap start to chase neon apples again.'
      default:
        return 'Munch glowing apples and avoid colliding with your grinning tail.'
    }
  }, [gameState.status])

  const snakeSet = useMemo(() => new Set(gameState.snake.map((segment) => `${segment.x}-${segment.y}`)), [gameState.snake])

  return (
    <div>
      <div style={hudStyle}>
        <span>Score: {gameState.score}</span>
        <span>Best: {highScore}</span>
        <span>Speed: {(1000 / gameState.speed).toFixed(1)} hz</span>
      </div>
      <div style={boardWrapperStyle}>
        <div style={boardStyle}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE
            const y = Math.floor(index / GRID_SIZE)
            const key = `${x}-${y}`
            const isSnake = snakeSet.has(key)
            const isHead = isSnake && gameState.snake[0].x === x && gameState.snake[0].y === y
            const isApple = gameState.apple.x === x && gameState.apple.y === y

            return (
              <div
                key={key}
                style={{
                  ...cellStyle,
                  background: isSnake
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 215, 0, 0.65))'
                    : cellStyle.background,
                  boxShadow: isSnake
                    ? '0 10px 18px rgba(255, 170, 255, 0.35)'
                    : cellStyle.boxShadow,
                  transform: isHead ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.1s ease',
                }}
              >
                {isSnake && <span style={emojiStyle}>{isHead ? '😄' : '😊'}</span>}
                {isApple && <span style={emojiStyle}>🍎</span>}
              </div>
            )
          })}
        </div>
      </div>
      <div style={controlsStyle}>
        <div style={buttonRowStyle}>
          <button type="button" style={controlButtonStyle} onClick={handleStartClick}>
            {gameState.status === 'running' ? 'Pause' : 'Start'}
          </button>
          <button
            type="button"
            style={{ ...controlButtonStyle, background: 'rgba(0, 255, 255, 0.12)' }}
            onClick={resetGame}
          >
            Reset
          </button>
        </div>
        <div style={directionPadStyle}>
          <div />
          <button type="button" style={directionButtonStyle} onClick={() => handleDirectionButton('up')}>
            Up
          </button>
          <div />
          <button type="button" style={directionButtonStyle} onClick={() => handleDirectionButton('left')}>
            Left
          </button>
          <div style={centerPadStyle}>•</div>
          <button type="button" style={directionButtonStyle} onClick={() => handleDirectionButton('right')}>
            Right
          </button>
          <div />
          <button type="button" style={directionButtonStyle} onClick={() => handleDirectionButton('down')}>
            Down
          </button>
          <div />
        </div>
        <p style={messageStyle}>{statusMessage}</p>
      </div>
    </div>
  )
}

const normalizeDirectionKey = (key) => {
  switch (key.toLowerCase()) {
    case 'up':
    case 'w':
      return 'up'
    case 'down':
    case 's':
      return 'down'
    case 'left':
    case 'a':
      return 'left'
    case 'right':
    case 'd':
      return 'right'
    default:
      return null
  }
}

const generateApple = (snake) => {
  let position
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y))
  return position
}

const isCollision = (head, snake) => {
  if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE) {
    return true
  }

  return snake.some((segment) => head.x === segment.x && head.y === segment.y)
}

const createInitialState = () => {
  const center = Math.floor(GRID_SIZE / 2)
  const initialSnake = [
    { x: center + 1, y: center },
    { x: center, y: center },
    { x: center - 1, y: center },
  ]

  return {
    snake: initialSnake,
    apple: generateApple(initialSnake),
    status: 'idle',
    score: 0,
    speed: BASE_SPEED,
  }
}

export default SmileSnakeGame
