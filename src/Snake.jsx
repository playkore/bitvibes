import { useCallback, useEffect, useRef, useState } from 'react'

const panelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '1.5rem',
  borderRadius: '1.5rem',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  background:
    'linear-gradient(145deg, rgba(8, 0, 35, 0.95), rgba(68, 0, 110, 0.78))',
  boxShadow:
    '0 30px 60px rgba(0, 0, 0, 0.35), inset 0 0 40px rgba(0, 255, 204, 0.18)',
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
  backgroundColor: 'rgba(0, 255, 204, 0.16)',
  color: '#73ffef',
  fontSize: '0.85rem',
  letterSpacing: '0.18em',
}

const canvasWrapperStyle = {
  position: 'relative',
  borderRadius: '1.25rem',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.08)',
}

const canvasStyle = {
  display: 'block',
  width: '100%',
  height: '100%',
  imageRendering: 'pixelated',
}

const footerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '0.8rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.65)',
}

const buttonStyle = {
  padding: '0.75rem 1.4rem',
  borderRadius: '0.9rem',
  border: '1px solid rgba(0, 255, 204, 0.6)',
  background: 'linear-gradient(135deg, rgba(0, 255, 204, 0.25), rgba(64, 0, 255, 0.35))',
  color: '#e6fffc',
  fontSize: '0.75rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
}

const GRID_SIZE = 18
const CANVAS_SIZE = 360

const Snake = () => {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  const stateRef = useRef({
    snake: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 },
    lastTime: 0,
    speed: 150,
  })

  const placeFood = useCallback(() => {
    const state = stateRef.current
    const availableCells = []

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        if (!state.snake.some((segment) => segment.x === x && segment.y === y)) {
          availableCells.push({ x, y })
        }
      }
    }

    if (availableCells.length === 0) {
      state.food = { x: 0, y: 0 }
      return
    }

    const choice = availableCells[Math.floor(Math.random() * availableCells.length)]
    state.food = choice
  }, [])

  const resetGame = useCallback(() => {
    const state = stateRef.current
    state.snake = [
      { x: Math.floor(GRID_SIZE / 2) + 1, y: Math.floor(GRID_SIZE / 2) },
      { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
    ]
    state.direction = { x: 1, y: 0 }
    state.nextDirection = { x: 1, y: 0 }
    state.lastTime = 0
    state.speed = 150

    placeFood()
    setScore(0)
    setIsPaused(false)
    setIsGameOver(false)
  }, [placeFood])

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    gradient.addColorStop(0, '#020210')
    gradient.addColorStop(1, '#160040')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    ctx.strokeStyle = 'rgba(0, 255, 204, 0.08)'
    for (let i = 0; i <= GRID_SIZE; i += 1) {
      const offset = (CANVAS_SIZE / GRID_SIZE) * i
      ctx.beginPath()
      ctx.moveTo(offset, 0)
      ctx.lineTo(offset, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, offset)
      ctx.lineTo(CANVAS_SIZE, offset)
      ctx.stroke()
    }

    const tileSize = CANVAS_SIZE / GRID_SIZE

    ctx.fillStyle = '#00f6d2'
    ctx.beginPath()
    ctx.arc(
      (stateRef.current.food.x + 0.5) * tileSize,
      (stateRef.current.food.y + 0.5) * tileSize,
      tileSize * 0.35,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    stateRef.current.snake.forEach((segment, index) => {
      const baseX = segment.x * tileSize
      const baseY = segment.y * tileSize
      const hue = 170 + index * 6
      ctx.fillStyle = `hsl(${hue}, 100%, 55%)`
      ctx.fillRect(baseX + 2, baseY + 2, tileSize - 4, tileSize - 4)
    })
  }, [])

  const advanceGame = useCallback(() => {
    const state = stateRef.current
    state.direction = state.nextDirection

    const head = {
      x: state.snake[0].x + state.direction.x,
      y: state.snake[0].y + state.direction.y,
    }

    const isOutOfBounds =
      head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE
    const hasSelfCollision = state.snake.some(
      (segment) => segment.x === head.x && segment.y === head.y,
    )

    if (isOutOfBounds || hasSelfCollision) {
      setIsGameOver(true)
      return
    }

    state.snake.unshift(head)

    if (head.x === state.food.x && head.y === state.food.y) {
      setScore((prev) => prev + 10)
      state.speed = Math.max(70, state.speed - 4)
      placeFood()
    } else {
      state.snake.pop()
    }
  }, [placeFood])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE
  }, [])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  const handleTouch = useCallback((event) => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const touch = event.touches?.[0] || event.changedTouches?.[0]
    if (!touch) {
      return
    }

    event.preventDefault()

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const canvasX = (touch.clientX - rect.left) * scaleX
    const canvasY = (touch.clientY - rect.top) * scaleY

    const state = stateRef.current
    const tileSize = CANVAS_SIZE / GRID_SIZE
    const head = state.snake[0]

    if (!head) {
      return
    }

    const headCenterX = (head.x + 0.5) * tileSize
    const headCenterY = (head.y + 0.5) * tileSize
    const diffX = canvasX - headCenterX
    const diffY = canvasY - headCenterY

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && state.direction.x !== -1) {
        state.nextDirection = { x: 1, y: 0 }
      } else if (diffX < 0 && state.direction.x !== 1) {
        state.nextDirection = { x: -1, y: 0 }
      }
    } else if (diffY > 0 && state.direction.y !== -1) {
      state.nextDirection = { x: 0, y: 1 }
    } else if (diffY < 0 && state.direction.y !== 1) {
      state.nextDirection = { x: 0, y: -1 }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.defaultPrevented) {
        return
      }

      const state = stateRef.current
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (state.direction.y !== 1) {
            state.nextDirection = { x: 0, y: -1 }
          }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (state.direction.y !== -1) {
            state.nextDirection = { x: 0, y: 1 }
          }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (state.direction.x !== 1) {
            state.nextDirection = { x: -1, y: 0 }
          }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (state.direction.x !== -1) {
            state.nextDirection = { x: 1, y: 0 }
          }
          break
        case ' ':
          event.preventDefault()
          if (isGameOver) {
            resetGame()
          } else {
            setIsPaused((prev) => !prev)
          }
          break
        case 'Enter':
          if (isGameOver) {
            resetGame()
          }
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isGameOver, resetGame])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return () => {}
    }

    canvas.addEventListener('touchstart', handleTouch, { passive: false })
    canvas.addEventListener('touchmove', handleTouch, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', handleTouch)
      canvas.removeEventListener('touchmove', handleTouch)
    }
  }, [handleTouch])

  useEffect(() => {
    const update = (time) => {
      const state = stateRef.current

      if (!state.lastTime) {
        state.lastTime = time
      }

      const delta = time - state.lastTime

      if (!isPaused && !isGameOver && delta >= state.speed) {
        advanceGame()
        state.lastTime = time
      }

      drawGame()
      state.animationFrame = requestAnimationFrame(update)
    }

    stateRef.current.animationFrame = requestAnimationFrame(update)

    return () => {
      if (stateRef.current.animationFrame) {
        cancelAnimationFrame(stateRef.current.animationFrame)
      }
    }
  }, [advanceGame, drawGame, isGameOver, isPaused])

  return (
    <div style={panelStyle}>
      <div style={statusStyle}>
        <span>Hyper Snake</span>
        <span style={statusHighlightStyle}>
          {isGameOver ? 'Game Over' : isPaused ? 'Paused' : `Score: ${score}`}
        </span>
      </div>
      <div style={{ ...statusStyle, fontSize: '0.75rem', opacity: 0.75 }}>
        <span>Tap, Arrow keys, or WASD to move</span>
        <span>Space to pause · Enter to restart</span>
      </div>
      <div style={canvasWrapperStyle}>
        <canvas
          ref={canvasRef}
          style={canvasStyle}
          role="img"
          aria-label="Snake game board"
        />
      </div>
      <div style={footerStyle}>
        <span>{isGameOver ? 'Press Enter to launch again' : 'Survive the neon grid'}</span>
        <button style={buttonStyle} type="button" onClick={resetGame}>
          Restart
        </button>
      </div>
    </div>
  )
}

export default Snake
