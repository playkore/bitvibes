import SmileSnakeGame from './games/SmileSnakeGame'

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #050816 0%, #1b004b 40%, #51008a 70%, #ff2d95 100%)',
  color: '#f9f7ff',
  fontFamily: '"Press Start 2P", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  padding: '3rem 1.5rem',
}

const panelStyle = {
  position: 'relative',
  maxWidth: '1100px',
  width: '100%',
  backgroundColor: 'rgba(7, 0, 33, 0.75)',
  borderRadius: '2.25rem',
  padding: '3.5rem 3rem',
  boxShadow:
    '0 40px 120px rgba(255, 45, 149, 0.45), inset 0 0 35px rgba(80, 0, 200, 0.45), 0 0 0 2px rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
}

const glowAccentStyle = {
  position: 'absolute',
  inset: '-40% -25% auto auto',
  width: '420px',
  height: '420px',
  background: 'radial-gradient(circle, rgba(255, 45, 149, 0.55) 0%, rgba(7, 0, 33, 0) 70%)',
  filter: 'blur(2px)',
  zIndex: 0,
}

const titleStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: '2.75rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '1.25rem',
  textShadow: '0 0 14px rgba(255, 82, 190, 0.9)',
}

const subtitleStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: '1rem',
  letterSpacing: '0.08em',
  lineHeight: 1.8,
  marginBottom: '2.75rem',
  color: 'rgba(229, 224, 255, 0.82)',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const listContainerStyle = {
  position: 'relative',
  zIndex: 1,
  borderRadius: '1.75rem',
  padding: '2.75rem',
  background: 'linear-gradient(145deg, rgba(20, 0, 55, 0.85), rgba(54, 0, 98, 0.65))',
  boxShadow: 'inset 0 0 40px rgba(255, 45, 149, 0.35)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
}

const listTitleStyle = {
  fontSize: '1rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  marginBottom: '2rem',
  color: 'rgba(255, 255, 255, 0.85)',
}

const listStyle = {
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  margin: 0,
  padding: 0,
}

const gameCardStyle = {
  background: 'rgba(10, 0, 28, 0.72)',
  borderRadius: '1.75rem',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow:
    'inset 0 0 25px rgba(255, 255, 255, 0.04), 0 25px 45px rgba(255, 0, 148, 0.25)',
}

const gameHeaderStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
}

const gameTitleStyle = {
  fontSize: '1.45rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  margin: 0,
  textShadow: '0 0 12px rgba(255, 149, 255, 0.75)',
}

const gameTaglineStyle = {
  margin: 0,
  fontSize: '0.85rem',
  letterSpacing: '0.06em',
  color: 'rgba(255, 255, 255, 0.64)',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const gameDescriptionStyle = {
  margin: 0,
  fontSize: '0.92rem',
  letterSpacing: '0.04em',
  lineHeight: 1.8,
  color: 'rgba(229, 224, 255, 0.82)',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const tagListStyle = {
  listStyle: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  margin: 0,
  padding: 0,
}

const tagStyle = {
  fontSize: '0.65rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  padding: '0.45rem 0.85rem',
  borderRadius: '9999px',
  background: 'rgba(255, 45, 149, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'rgba(255, 255, 255, 0.88)',
}

const gamePreviewStyle = {
  borderRadius: '1.5rem',
  padding: '1.5rem',
  background: 'rgba(7, 0, 35, 0.75)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: 'inset 0 0 25px rgba(255, 0, 149, 0.25)',
}

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
}

const games = [
  {
    title: 'Smile Snake',
    tagline: 'Retro slithering with a neon grin.',
    description:
      'Guide a radiant, smiling serpent through the synthwave grid and collect glowing apples without colliding with your own tail.',
    tags: ['Arcade', 'Endless', 'Emoji-powered'],
    component: SmileSnakeGame,
  },
]

const App = () => {
  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <span aria-hidden="true" style={glowAccentStyle} />
        <h1 style={titleStyle}>Bitvibes Arcade</h1>
        <p style={subtitleStyle}>
          Plug in your headphones, turn up the synths, and get ready to cruise through neon dreams. This is your retro-wave hub
          for upcoming indie experiences.
        </p>
        <section style={listContainerStyle}>
          <h2 style={listTitleStyle}>Featured Games</h2>
          <ul style={listStyle}>
            {games.map((game) => {
              const GameComponent = game.component
              return (
                <li key={game.title} style={gameCardStyle}>
                  <div style={gameHeaderStyle}>
                    <h3 style={gameTitleStyle}>{game.title}</h3>
                    <p style={gameTaglineStyle}>{game.tagline}</p>
                  </div>
                  <p style={gameDescriptionStyle}>{game.description}</p>
                  <ul style={tagListStyle}>
                    {game.tags.map((tag) => (
                      <li key={tag} style={tagStyle}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div style={gamePreviewStyle}>
                    <GameComponent />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
        <p style={footerStyle}>Stay tuned — new vibes are on their way.</p>
      </div>
    </div>
  )
}

export default App
