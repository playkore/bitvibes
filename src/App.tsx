import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import TicTacToe from './TicTacToe'
import Snake from './Snake'

type Game = {
  title: string
  description: string
  component: ReactNode
}

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

const listContainerStyle = {
  position: 'relative',
  zIndex: 1,
  borderRadius: '1.75rem',
  padding: '2.5rem',
  background: 'linear-gradient(145deg, rgba(20, 0, 55, 0.85), rgba(54, 0, 98, 0.65))',
  boxShadow: 'inset 0 0 40px rgba(255, 45, 149, 0.35)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
} satisfies CSSProperties

const listTitleStyle = {
  fontSize: '1rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  marginBottom: '1.5rem',
  color: 'rgba(255, 255, 255, 0.85)',
} satisfies CSSProperties

const listStyle = {
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.75rem',
  margin: 0,
  padding: 0,
} satisfies CSSProperties

const listItemStyle = {
  margin: 0,
} satisfies CSSProperties

const gameButtonStyle = {
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  borderRadius: '1.5rem',
  padding: '1.8rem',
  background:
    'linear-gradient(140deg, rgba(26, 0, 70, 0.88), rgba(56, 0, 122, 0.72))',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow:
    'inset 0 0 35px rgba(255, 45, 149, 0.18), 0 12px 40px rgba(0, 0, 0, 0.45)',
  color: '#f9f7ff',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  font: 'inherit',
  letterSpacing: 'inherit',
} satisfies CSSProperties

const gameButtonTitleStyle = {
  fontSize: '1.1rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  textShadow: '0 0 12px rgba(255, 82, 190, 0.8)',
} satisfies CSSProperties

const gameDescriptionStyle = {
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '0.92rem',
  lineHeight: 1.7,
  color: 'rgba(235, 229, 255, 0.85)',
} satisfies CSSProperties

const activeGameContainerStyle = {
  position: 'relative',
  zIndex: 1,
  borderRadius: '1.75rem',
  padding: '2.5rem',
  background: 'linear-gradient(145deg, rgba(20, 0, 55, 0.85), rgba(54, 0, 98, 0.65))',
  boxShadow: 'inset 0 0 40px rgba(255, 45, 149, 0.35)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
} satisfies CSSProperties

const activeGameHeaderStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
} satisfies CSSProperties

const activeGameTitleStyle = {
  fontSize: '1.4rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  textShadow: '0 0 14px rgba(255, 82, 190, 0.9)',
} satisfies CSSProperties

const backButtonStyle = {
  alignSelf: 'flex-start',
  padding: '0.75rem 1.5rem',
  borderRadius: '999px',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  background: 'rgba(15, 0, 45, 0.7)',
  color: '#f9f7ff',
  cursor: 'pointer',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '0.85rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
} satisfies CSSProperties

const gameAreaStyle = {
  borderRadius: '1.25rem',
  padding: '1.5rem',
  background: 'rgba(5, 0, 28, 0.75)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: 'inset 0 0 28px rgba(255, 45, 149, 0.2)',
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
  ]

  const [activeGame, setActiveGame] = useState<Game | null>(null)

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <span aria-hidden="true" style={glowAccentStyle} />
        <h1 style={titleStyle}>Bitvibes Arcade</h1>
        <p style={subtitleStyle}>
          Plug in your headphones, turn up the synths, and get ready to cruise through neon
          dreams. This is your retro-wave hub for upcoming indie experiences.
        </p>
        {activeGame ? (
          <section style={activeGameContainerStyle}>
            <button onClick={() => setActiveGame(null)} style={backButtonStyle} type="button">
              Back to Games
            </button>
            <div style={activeGameHeaderStyle}>
              <h2 style={activeGameTitleStyle}>{activeGame.title}</h2>
              <p style={gameDescriptionStyle}>{activeGame.description}</p>
            </div>
            <div style={gameAreaStyle}>{activeGame.component}</div>
          </section>
        ) : (
          <section style={listContainerStyle}>
            <h2 style={listTitleStyle}>Featured Games</h2>
            <ul style={listStyle}>
              {games.map((game) => (
                <li key={game.title} style={listItemStyle}>
                  <button
                    onClick={() => setActiveGame(game)}
                    style={gameButtonStyle}
                    type="button"
                  >
                    <div>
                      <h3 style={gameButtonTitleStyle}>{game.title}</h3>
                      <p style={gameDescriptionStyle}>{game.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p style={footerStyle}>Stay tuned — new vibes are on their way.</p>
      </div>
    </div>
  )
}

export default App
