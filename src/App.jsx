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
  maxWidth: '860px',
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
  padding: '2.5rem',
  background: 'linear-gradient(145deg, rgba(20, 0, 55, 0.85), rgba(54, 0, 98, 0.65))',
  boxShadow: 'inset 0 0 40px rgba(255, 45, 149, 0.35)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
}

const listTitleStyle = {
  fontSize: '1rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  marginBottom: '1.5rem',
  color: 'rgba(255, 255, 255, 0.85)',
}

const listStyle = {
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1.5rem',
  margin: 0,
  padding: 0,
}

const emptyStateStyle = {
  gridColumn: '1 / -1',
  fontSize: '0.95rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.5)',
  textAlign: 'center',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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

const App = () => {
  const games = []

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <span aria-hidden="true" style={glowAccentStyle} />
        <h1 style={titleStyle}>Bitvibes Arcade</h1>
        <p style={subtitleStyle}>
          Plug in your headphones, turn up the synths, and get ready to cruise through neon
          dreams. This is your retro-wave hub for upcoming indie experiences.
        </p>
        <section style={listContainerStyle}>
          <h2 style={listTitleStyle}>Featured Games</h2>
          <ul style={listStyle}>
            {games.map((game) => (
              <li key={game.title}>{game.title}</li>
            ))}
            {games.length === 0 && (
              <li style={emptyStateStyle}>No games uploaded to the arcade yet.</li>
            )}
          </ul>
        </section>
        <p style={footerStyle}>Stay tuned — new vibes are on their way.</p>
      </div>
    </div>
  )
}

export default App
