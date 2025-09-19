import type { CSSProperties } from 'react'

import type { Game } from '../types'

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
  background: 'linear-gradient(140deg, rgba(26, 0, 70, 0.88), rgba(56, 0, 122, 0.72))',
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

type TitleScreenProps = {
  games: Game[]
  onSelectGame: (game: Game) => void
}

const TitleScreen = ({ games, onSelectGame }: TitleScreenProps) => (
  <section style={listContainerStyle}>
    <h2 style={listTitleStyle}>Featured Games</h2>
    <ul style={listStyle}>
      {games.map((game) => (
        <li key={game.title} style={listItemStyle}>
          <button onClick={() => onSelectGame(game)} style={gameButtonStyle} type="button">
            <div>
              <h3 style={gameButtonTitleStyle}>{game.title}</h3>
              <p style={gameDescriptionStyle}>{game.description}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  </section>
)

export default TitleScreen
