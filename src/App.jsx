import { useState } from 'react'

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  color: '#1f2933',
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  textAlign: 'center',
  padding: '2rem',
}

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '1.5rem',
  padding: '2.5rem',
  boxShadow: '0 25px 45px rgba(15, 23, 42, 0.1)',
  maxWidth: '32rem',
  width: '100%',
}

const titleStyle = {
  fontSize: '2.5rem',
  marginBottom: '0.75rem',
  letterSpacing: '-0.04em',
}

const textStyle = {
  fontSize: '1.125rem',
  lineHeight: 1.6,
  marginBottom: '1.5rem',
  color: '#475569',
}

const buttonStyle = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  border: 'none',
  borderRadius: '9999px',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '0.85rem 2.5rem',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 18px 30px rgba(99, 102, 241, 0.35)',
}

const buttonHoverStyle = {
  transform: 'translateY(-2px) scale(1.01)',
  boxShadow: '0 25px 35px rgba(99, 102, 241, 0.45)',
}

function App() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Welcome to Bitvibes</h1>
        <p style={textStyle}>
          This React app is powered by Vite and styled entirely with inline CSS,
          keeping everything you see directly inside the component.
        </p>
        <button
          type="button"
          style={isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Explore the vibe
        </button>
      </div>
    </div>
  )
}

export default App
