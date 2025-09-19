import type { CSSProperties } from 'react'

import type { Game } from '../types'

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

const gameDescriptionStyle = {
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '0.92rem',
  lineHeight: 1.7,
  color: 'rgba(235, 229, 255, 0.85)',
} satisfies CSSProperties

const gameAreaStyle = {
  borderRadius: '1.25rem',
  padding: '1.5rem',
  background: 'rgba(5, 0, 28, 0.75)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: 'inset 0 0 28px rgba(255, 45, 149, 0.2)',
} satisfies CSSProperties

type ActiveGameScreenProps = {
  game: Game
  onBack: () => void
}

const ActiveGameScreen = ({ game, onBack }: ActiveGameScreenProps) => (
  <section style={activeGameContainerStyle}>
    <button onClick={onBack} style={backButtonStyle} type="button">
      Back to Games
    </button>
    <div style={activeGameHeaderStyle}>
      <h2 style={activeGameTitleStyle}>{game.title}</h2>
      <p style={gameDescriptionStyle}>{game.description}</p>
    </div>
    <div style={gameAreaStyle}>{game.component}</div>
  </section>
)

export default ActiveGameScreen
