import { BarChart3, Upload, Clock } from 'lucide-react'
import type { Page } from '../App'

interface HeaderProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header style={{
      background: 'rgba(8,8,15,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => onNavigate('upload')}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BarChart3 size={20} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-h)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--text)'
          }}>
            Social Media <span style={{ color: 'var(--accent)' }}>Analyzer</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'upload' as Page, label: 'Analyze', icon: Upload },
            { id: 'history' as Page, label: 'History', icon: Clock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-b)',
                fontWeight: 500,
                transition: 'all 0.2s',
                background: currentPage === id ? 'rgba(124,111,255,0.15)' : 'transparent',
                color: currentPage === id ? 'var(--accent)' : 'var(--text2)',
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
