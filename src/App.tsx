import { useState } from 'react'
import type { CSSProperties } from 'react'

import ActiveGameScreen from './components/ActiveGameScreen'
import TitleScreen from './components/TitleScreen'
import Paratrooper from './games/Paratrooper'
import Snake from './games/Snake'
import TicTacToe from './games/TicTacToe'
import type { Game } from './types'

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #050816 0%, #1b004b 40%, #51008a 70%, #ff2d95 100%)',
  color: '#f9f7ff',
  fontFamily: '"Press Start 2P", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  padding: '3rem 1.5rem',
} satisfies CSSProperties

const panelStyle = {
  position: 'relative',
  maxWidth: '860px',
  width: '100%',
  backgroundColor: 'rgba(7, 0, 33, 0.75)',
  borderRadius: '2.25rem',
  padding: '3.5rem 3rem',
  boxShadow:
    '0 40px 120px rgba(255, 45, 149, 0.45), inset 0 0 35px rgba(80, 0, 200, 0.45), 0 0 0 2px rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
} satisfies CSSProperties

const glowAccentStyle = {
  position: 'absolute',
  inset: '-40% -25% auto auto',
  width: '420px',
  height: '420px',
  background: 'radial-gradient(circle, rgba(255, 45, 149, 0.55) 0%, rgba(7, 0, 33, 0) 70%)',
  filter: 'blur(2px)',
  zIndex: 0,
} satisfies CSSProperties

const titleStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: '2.75rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '1.25rem',
  textShadow: '0 0 14px rgba(255, 82, 190, 0.9)',
} satisfies CSSProperties

const subtitleStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: '1rem',
  letterSpacing: '0.08em',
  lineHeight: 1.8,
  marginBottom: '2.75rem',
  color: 'rgba(229, 224, 255, 0.82)',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} satisfies CSSProperties

const footerStyle = {
  position: 'relative',
  zIndex: 1,
  marginTop: '2.5rem',
  fontSize: '0.85rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.45)',
  textAlign: 'center',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} satisfies CSSProperties

const App = () => {
  const games: Game[] = [
    {
      title: 'Hyper Snake',
      description:
        'Race through the grid, collect neon energy, and grow without colliding in this synthwave-infused classic.',
      component: <Snake />,
    },
    {
      title: 'Tic-Tac-Toe: Neon Grid',
      description:
        'Challenge a friend or test your own strategy with glowing Xs and Os in this synthwave showdown.',
      component: <TicTacToe />,
    },
    {
      title: 'Paratrooper Rewind',
      description:
        'Defend the neon skyline from waves of retro invaders in this pulsating arcade homage to the classics.',
      component: <Paratrooper />,
    },
  ]

  const [activeGame, setActiveGame] = useState<Game | null>(null)

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <span aria-hidden="true" style={glowAccentStyle} />
        <h1 style={titleStyle}>Bitvibes Arcade</h1>
        <p style={subtitleStyle}>
          Plug in your headphones, turn up the synths, and get ready to cruise through neon dreams. This is your
          retro-wave hub for upcoming indie experiences.
        </p>
        {activeGame ? (
          <ActiveGameScreen game={activeGame} onBack={() => setActiveGame(null)} />
        ) : (
          <TitleScreen games={games} onSelectGame={setActiveGame} />
        )}
        <p style={footerStyle}>Stay tuned — new vibes are on their way.</p>
      </div>
    </div>
  )
}

export default App
