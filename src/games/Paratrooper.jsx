import { useEffect, useRef } from 'react'
import './Paratrooper.css'

const Paratrooper = () => {
  const canvasRef = useRef(null)
  const infoScreenRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const infoScreen = infoScreenRef.current

    if (!canvas || !infoScreen) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const titleElement = infoScreen.querySelector('[data-role="title"]')
    const instructionsElement = infoScreen.querySelector('[data-role="instructions"]')
    const promptElement = infoScreen.querySelector('[data-role="prompt"]')

    const COLORS = {
      BG: '#000000',
      CYAN: '#00FFFF',
      MAGENTA: '#FF00FF',
      WHITE: '#FFFFFF',
    }

    const GAME_STATE = {
      TITLE: 0,
      PLAYING: 1,
      GAME_OVER: 2,
    }

    let gameState = GAME_STATE.TITLE
    let scale = 1
    let audioCtx
    let animationFrameId = 0

    const keys = {}
    let isFiring = false
    let lastTime = 0
    let enemySpawnTimer = 0
    let jetSpawnTimer = 5000

    const playerState = {
      baseWidth: 80,
      baseHeight: 30,
      turretWidth: 10,
      turretHeight: 20,
      barrelLength: 40,
      angle: -Math.PI / 2,
      rotationSpeed: 0.05,
      fireCooldown: 200,
      lastFireTime: 0,
    }

    let player
    let bullets
    let enemies
    let particles
    let landedTroopers
    let score = 0
    let highScore = 0

    try {
      const saved = window.localStorage.getItem('paratrooperHighScore')
      highScore = saved ? Number(saved) || 0 : 0
    } catch (error) {
      highScore = 0
    }

    function resizeCanvas() {
      const aspectRatio = 4 / 3
      const width = window.innerWidth
      const height = window.innerHeight

      if (width / height > aspectRatio) {
        canvas.height = height
        canvas.width = height * aspectRatio
      } else {
        canvas.width = width
        canvas.height = width / aspectRatio
      }

      scale = canvas.width / 800
      infoScreen.style.fontSize = `${1.5 * scale}em`

      ctx.imageSmoothingEnabled = false
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      }
    }

    function playSound(type) {
      if (!audioCtx) return

      const now = audioCtx.currentTime
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      switch (type) {
        case 'shoot':
          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(800, now)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
          oscillator.start(now)
          oscillator.stop(now + 0.1)
          break
        case 'explosion':
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(400, now)
          oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2)
          gainNode.gain.setValueAtTime(0.2, now)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
          oscillator.start(now)
          oscillator.stop(now + 0.2)
          break
        case 'hit_chute':
          oscillator.type = 'triangle'
          oscillator.frequency.setValueAtTime(1200, now)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
          oscillator.start(now)
          oscillator.stop(now + 0.1)
          break
        case 'land':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(100, now)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
          oscillator.start(now)
          oscillator.stop(now + 0.2)
          break
        case 'game_over': {
          const frequencies = [440, 415, 392, 370, 349, 330, 311, 293]
          frequencies.forEach((freq, i) => {
            const osc = audioCtx.createOscillator()
            const gain = audioCtx.createGain()
            osc.connect(gain)
            gain.connect(audioCtx.destination)
            osc.type = 'sawtooth'
            osc.frequency.setValueAtTime(freq, now + i * 0.1)
            gain.gain.setValueAtTime(0.15, now + i * 0.1)
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.1)
            osc.start(now + i * 0.1)
            osc.stop(now + i * 0.1 + 0.1)
          })
          break
        }
        default:
          break
      }
    }

    function createExplosion(x, y, color, count = 20) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4 * scale,
          vy: (Math.random() - 0.5) * 4 * scale,
          life: 30,
          color,
        })
      }
    }

    function spawnHelicopter() {
      const speed = (1 + score / 500) * scale * 2
      enemies.push({
        type: 'helicopter',
        x: -50 * scale,
        y: (Math.random() * 0.2 + 0.05) * canvas.height,
        width: 60 * scale,
        height: 25 * scale,
        speed,
        dropTimer: Math.random() * 1000 + 500,
        health: 2,
      })
    }

    function spawnJet() {
      const direction = Math.random() < 0.5 ? 1 : -1
      enemies.push({
        type: 'jet',
        x: direction === 1 ? -60 * scale : canvas.width + 60 * scale,
        y: (Math.random() * 0.15 + 0.05) * canvas.height,
        width: 70 * scale,
        height: 20 * scale,
        speed: (6 + score / 1000) * scale * direction,
        dropTimer: 100,
        health: 1,
      })
    }

    function spawnTrooper(x, y) {
      enemies.push({
        type: 'trooper',
        x,
        y,
        width: 10 * scale,
        height: 40 * scale,
        speedY: (0.8 + score / 1000) * scale,
        hasChute: true,
      })
    }

    function spawnBomb(x, y) {
      enemies.push({
        type: 'bomb',
        x,
        y,
        width: 8 * scale,
        height: 12 * scale,
        speedY: (4 + score / 800) * scale,
      })
    }

    function resetGame() {
      player = {
        x: canvas.width / 2,
        y: canvas.height - playerState.baseHeight,
        angle: -Math.PI / 2,
        isDestroyed: false,
        destroyTimer: 0,
      }
      bullets = []
      enemies = []
      particles = []
      landedTroopers = { left: [], right: [] }
      score = 0
      enemySpawnTimer = 0
      jetSpawnTimer = Math.random() * 5000 + 10000
      playerState.lastFireTime = 0
    }

    function destroyPlayer() {
      if (player.isDestroyed) return
      player.isDestroyed = true
      player.destroyTimer = 1000
      createExplosion(player.x, player.y, COLORS.MAGENTA, 100)
      createExplosion(player.x, player.y, COLORS.WHITE, 100)
    }

    function drawPixel(x, y, color) {
      ctx.fillStyle = color
      ctx.fillRect(Math.floor(x), Math.floor(y), scale, scale)
    }

    function drawText(text, x, y, color, size) {
      ctx.font = `${size * scale}px 'Press Start 2P'`
      ctx.fillStyle = color
      ctx.fillText(text, x, y)
    }

    function drawPlayer() {
      if (player.isDestroyed) return

      const { x, y, angle } = player

      ctx.fillStyle = COLORS.WHITE
      ctx.fillRect(
        x - (playerState.baseWidth / 2) * scale,
        y,
        playerState.baseWidth * scale,
        playerState.baseHeight * scale,
      )

      ctx.fillStyle = COLORS.MAGENTA
      ctx.fillRect(
        x - (playerState.turretWidth / 2) * scale,
        y - playerState.turretHeight * scale,
        playerState.turretWidth * scale,
        playerState.turretHeight * scale,
      )

      ctx.save()
      ctx.translate(x, y - (playerState.turretHeight / 2) * scale)
      ctx.rotate(angle)
      ctx.strokeStyle = COLORS.CYAN
      ctx.lineWidth = 4 * scale
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(playerState.barrelLength * scale, 0)
      ctx.stroke()
      ctx.restore()
    }

    function drawBullet(bullet) {
      ctx.fillStyle = COLORS.WHITE
      ctx.fillRect(bullet.x - 1 * scale, bullet.y - 1 * scale, 3 * scale, 3 * scale)
    }

    function drawHelicopter(enemy) {
      ctx.fillStyle = COLORS.WHITE
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height * 0.6)
      ctx.fillRect(enemy.x - 10 * scale, enemy.y + 5 * scale, 10 * scale, 5 * scale)
      ctx.fillStyle = COLORS.MAGENTA
      ctx.fillRect(enemy.x + enemy.width / 2 - 15 * scale, enemy.y - 5 * scale, 30 * scale, 5 * scale)
    }

    function drawJet(jet) {
      ctx.fillStyle = COLORS.CYAN
      ctx.beginPath()
      if (jet.speed > 0) {
        ctx.moveTo(jet.x, jet.y + jet.height / 2)
        ctx.lineTo(jet.x + jet.width, jet.y + jet.height / 2)
        ctx.lineTo(jet.x + jet.width * 0.8, jet.y)
        ctx.lineTo(jet.x + jet.width * 0.2, jet.y)
        ctx.closePath()
      } else {
        ctx.moveTo(jet.x + jet.width, jet.y + jet.height / 2)
        ctx.lineTo(jet.x, jet.y + jet.height / 2)
        ctx.lineTo(jet.x + jet.width * 0.2, jet.y)
        ctx.lineTo(jet.x + jet.width * 0.8, jet.y)
        ctx.closePath()
      }
      ctx.fill()
    }

    function drawTrooper(trooper) {
      const bodyY = trooper.y + 20 * scale
      if (trooper.hasChute) {
        ctx.fillStyle = COLORS.CYAN
        ctx.beginPath()
        ctx.arc(trooper.x, trooper.y + 10 * scale, 15 * scale, Math.PI, 0)
        ctx.fill()
        ctx.strokeStyle = COLORS.WHITE
        ctx.lineWidth = 1 * scale
        ctx.beginPath()
        ctx.moveTo(trooper.x, bodyY)
        ctx.lineTo(trooper.x - 10 * scale, trooper.y + 10 * scale)
        ctx.moveTo(trooper.x, bodyY)
        ctx.lineTo(trooper.x + 10 * scale, trooper.y + 10 * scale)
        ctx.stroke()
      }

      ctx.fillStyle = COLORS.CYAN
      ctx.fillRect(trooper.x - 2 * scale, bodyY, 4 * scale, 10 * scale)
      ctx.fillRect(trooper.x - 2 * scale, bodyY - 4 * scale, 4 * scale, 4 * scale)
      ctx.fillRect(trooper.x - 4 * scale, bodyY + 10 * scale, 2 * scale, 8 * scale)
      ctx.fillRect(trooper.x + 2 * scale, bodyY + 10 * scale, 2 * scale, 8 * scale)
    }

    function drawLandedTrooper(trooper) {
      ctx.fillStyle = COLORS.CYAN
      ctx.fillRect(trooper.x - 2 * scale, trooper.y, 4 * scale, 10 * scale)
      ctx.fillRect(trooper.x - 2 * scale, trooper.y - 4 * scale, 4 * scale, 4 * scale)
      ctx.fillRect(trooper.x - 4 * scale, trooper.y + 10 * scale, 2 * scale, 8 * scale)
      ctx.fillRect(trooper.x + 2 * scale, trooper.y + 10 * scale, 2 * scale, 8 * scale)
    }

    function drawBomb(bomb) {
      ctx.fillStyle = COLORS.WHITE
      ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height)
      ctx.fillStyle = COLORS.MAGENTA
      ctx.fillRect(bomb.x, bomb.y, bomb.width, 2 * scale)
    }

    function draw() {
      ctx.fillStyle = COLORS.BG
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (gameState === GAME_STATE.TITLE) {
        return
      }

      drawPlayer()

      bullets.forEach(drawBullet)
      enemies.forEach((enemy) => {
        if (enemy.type === 'helicopter') drawHelicopter(enemy)
        else if (enemy.type === 'trooper') drawTrooper(enemy)
        else if (enemy.type === 'jet') drawJet(enemy)
        else if (enemy.type === 'bomb') drawBomb(enemy)
      })

      landedTroopers.left.forEach(drawLandedTrooper)
      landedTroopers.right.forEach(drawLandedTrooper)

      particles.forEach((p) => {
        drawPixel(p.x, p.y, p.color)
      })

      drawText(`PUNTI: ${score}`, 20 * scale, canvas.height - 10 * scale, COLORS.CYAN, 20)
      drawText(`RECORD: ${highScore}`, canvas.width - 250 * scale, canvas.height - 10 * scale, COLORS.CYAN, 20)
    }

    function update(deltaTime) {
      if (gameState !== GAME_STATE.PLAYING) return

      if (player.isDestroyed) {
        player.destroyTimer -= deltaTime
        if (player.destroyTimer <= 0) {
          gameState = GAME_STATE.GAME_OVER
          infoScreen.style.display = 'block'
          if (titleElement) titleElement.textContent = 'GAME OVER'
          if (instructionsElement) instructionsElement.textContent = `FINAL SCORE: ${score}`
          if (promptElement) promptElement.textContent = 'CLICK OR TAP TO RESTART'
          if (score > highScore) {
            highScore = score
            try {
              window.localStorage.setItem('paratrooperHighScore', String(highScore))
            } catch (error) {
              // ignore storage errors
            }
          }
          playSound('game_over')
        }
        return
      }

      if (keys.ArrowLeft || keys.KeyA) {
        player.angle -= playerState.rotationSpeed
      }
      if (keys.ArrowRight || keys.KeyD) {
        player.angle += playerState.rotationSpeed
      }
      player.angle = Math.max(-Math.PI, Math.min(0, player.angle))

      if (keys.Space || isFiring) {
        if (Date.now() - playerState.lastFireTime > playerState.fireCooldown) {
          playerState.lastFireTime = Date.now()
          playSound('shoot')
          const barrelEndX = player.x + Math.cos(player.angle) * playerState.barrelLength * scale
          const barrelEndY =
            player.y - (playerState.turretHeight * scale) / 2 + Math.sin(player.angle) * playerState.barrelLength * scale
          bullets.push({
            x: barrelEndX,
            y: barrelEndY,
            vx: Math.cos(player.angle) * 15 * scale,
            vy: Math.sin(player.angle) * 15 * scale,
          })
        }
      }
      isFiring = false

      bullets.forEach((bullet, index) => {
        bullet.x += bullet.vx
        bullet.y += bullet.vy
        if (bullet.y < 0 || bullet.x < 0 || bullet.x > canvas.width) {
          bullets.splice(index, 1)
        }
      })

      enemySpawnTimer -= deltaTime
      if (enemySpawnTimer <= 0) {
        spawnHelicopter()
        enemySpawnTimer = Math.max(1000, 4000 - score * 5)
      }
      if (score > 150) {
        jetSpawnTimer -= deltaTime
        if (jetSpawnTimer <= 0) {
          spawnJet()
          jetSpawnTimer = Math.max(3000, 12000 - score * 10)
        }
      }

      enemies.forEach((enemy, eIndex) => {
        if (enemy.type === 'helicopter' || enemy.type === 'jet') {
          enemy.x += enemy.speed
          enemy.dropTimer -= deltaTime
          if (enemy.dropTimer <= 0) {
            if (enemy.type === 'helicopter') {
              spawnTrooper(enemy.x + enemy.width / 2, enemy.y + enemy.height)
              enemy.dropTimer = Math.random() * 2000 + 1000
            } else {
              spawnBomb(enemy.x, enemy.y + enemy.height)
              enemy.dropTimer = 200
            }
          }
          if (enemy.x > canvas.width + 100 || enemy.x < -100) {
            enemies.splice(eIndex, 1)
          }
        } else if (enemy.type === 'trooper') {
          enemy.y += enemy.speedY
          if (enemy.y > canvas.height - playerState.baseHeight - 10 * scale) {
            playSound('land')
            const side = enemy.x < canvas.width / 2 ? 'left' : 'right'
            const stack = landedTroopers[side]

            enemy.y = canvas.height - playerState.baseHeight - stack.length * 15 * scale - 10 * scale
            if (side === 'left') {
              enemy.x = canvas.width / 2 - playerState.baseWidth / 2 - stack.length * 10 * scale - 10 * scale
            } else {
              enemy.x = canvas.width / 2 + playerState.baseWidth / 2 + stack.length * 10 * scale + 10 * scale
            }

            stack.push(enemy)
            enemies.splice(eIndex, 1)

            if (stack.length >= 4) {
              destroyPlayer()
            } else {
              const otherSide = side === 'left' ? 'right' : 'left'
              if (landedTroopers[otherSide].length >= 4) {
                destroyPlayer()
              }
            }
          }
        } else if (enemy.type === 'bomb') {
          enemy.y += enemy.speedY
          if (enemy.y > canvas.height - playerState.baseHeight) {
            createExplosion(enemy.x, canvas.height - playerState.baseHeight / 2, COLORS.WHITE, 20)
            playSound('explosion')
            enemies.splice(eIndex, 1)
          }
        }
      })

      particles.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1
        if (p.life <= 0) {
          particles.splice(index, 1)
        }
      })

      bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
          if (enemy.type === 'trooper') {
            if (
              bullet.x > enemy.x - enemy.width / 2 &&
              bullet.x < enemy.x + enemy.width / 2 &&
              bullet.y > enemy.y - enemy.height &&
              bullet.y < enemy.y + enemy.height
            ) {
              playSound(enemy.hasChute ? 'hit_chute' : 'explosion')
              createExplosion(enemy.x, enemy.y, COLORS.CYAN, 20)
              bullets.splice(bIndex, 1)
              enemies.splice(eIndex, 1)
              score += enemy.hasChute ? 5 : 10
            }
          } else if (enemy.type === 'helicopter' || enemy.type === 'jet') {
            if (
              bullet.x > enemy.x &&
              bullet.x < enemy.x + enemy.width &&
              bullet.y > enemy.y &&
              bullet.y < enemy.y + enemy.height
            ) {
              enemy.health -= 1
              createExplosion(bullet.x, bullet.y, COLORS.WHITE, 10)
              bullets.splice(bIndex, 1)
              if (enemy.health <= 0) {
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, COLORS.MAGENTA, 40)
                playSound('explosion')
                enemies.splice(eIndex, 1)
                score += enemy.type === 'helicopter' ? 20 : 35
              }
            }
          } else if (enemy.type === 'bomb') {
            if (
              bullet.x > enemy.x &&
              bullet.x < enemy.x + enemy.width &&
              bullet.y > enemy.y &&
              bullet.y < enemy.y + enemy.height
            ) {
              createExplosion(enemy.x, enemy.y, COLORS.WHITE, 15)
              playSound('explosion')
              enemies.splice(eIndex, 1)
              bullets.splice(bIndex, 1)
              score += 15
            }
          }
        })
      })

      if (!player.isDestroyed) {
        enemies.forEach((enemy) => {
          if (enemy.type === 'bomb') {
            if (
              enemy.x > player.x - (playerState.baseWidth / 2) &&
              enemy.x < player.x + (playerState.baseWidth / 2) &&
              enemy.y > player.y - playerState.baseHeight / 2
            ) {
              destroyPlayer()
            }
          }
        })
      }
    }

    function gameLoop(timestamp) {
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      update(deltaTime)
      draw()

      animationFrameId = window.requestAnimationFrame(gameLoop)
    }

    function handleKeyDown(e) {
      keys[e.code] = true
      if (e.code === 'Space') {
        e.preventDefault()
      }
    }

    function handleKeyUp(e) {
      keys[e.code] = false
    }

    function handleInteraction(e) {
      e.preventDefault()
      initAudio()

      if (gameState === GAME_STATE.PLAYING) {
        if (!player.isDestroyed) {
          const rect = canvas.getBoundingClientRect()
          const pointer = 'touches' in e ? e.touches[0] : e
          const x = pointer.clientX - rect.left
          const y = pointer.clientY - rect.top

          const dx = x - player.x
          const dy = y - (player.y - (playerState.turretHeight / 2) * scale)
          player.angle = Math.atan2(dy, dx)
          isFiring = true
        }
      } else {
        gameState = GAME_STATE.PLAYING
        infoScreen.style.display = 'none'
        if (titleElement) titleElement.textContent = 'PARATROOPER'
        if (instructionsElement) {
          instructionsElement.innerHTML = 'ARROW KEYS TO AIM, SPACE TO FIRE<br>ON MOBILE: TAP TO AIM &amp; FIRE'
        }
        if (promptElement) promptElement.textContent = 'CLICK OR TAP TO START'
        resetGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    canvas.addEventListener('mousedown', handleInteraction)
    canvas.addEventListener('touchstart', handleInteraction, { passive: false })
    infoScreen.addEventListener('click', handleInteraction)
    infoScreen.addEventListener('touchstart', handleInteraction, { passive: false })

    resetGame()
    animationFrameId = window.requestAnimationFrame(gameLoop)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      canvas.removeEventListener('mousedown', handleInteraction)
      canvas.removeEventListener('touchstart', handleInteraction)
      infoScreen.removeEventListener('click', handleInteraction)
      infoScreen.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

  return (
    <div className="paratrooper-root">
      <div className="paratrooper-stage">
        <div ref={infoScreenRef} className="paratrooper-info">
          <h1 data-role="title">PARATROOPER</h1>
          <p data-role="instructions">
            ARROW KEYS TO AIM, SPACE TO FIRE
            <br />
            ON MOBILE: TAP TO AIM &amp; FIRE
          </p>
          <p className="prompt" data-role="prompt">
            CLICK OR TAP TO START
          </p>
        </div>
        <canvas ref={canvasRef} className="paratrooper-canvas" />
      </div>
    </div>
  )
}

export default Paratrooper
