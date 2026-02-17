import { ArrowLeft, Hash, AtSign, Smile, FileText, TrendingUp, Lightbulb, Copy, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import type { AnalysisData } from '../App'

interface ResultsPageProps {
  data: AnalysisData
  onBack: () => void
}

const ScoreCircle = ({ score, label, color }: { score: number, label: string, color: string }) => {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="36" y="40" textAnchor="middle" fill="white" fontSize="13" fontWeight="700"
          fontFamily="'Syne', sans-serif">{score}</text>
      </svg>
      <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors: Record<string, string> = {
    high: '#f87171', medium: '#fbbf24', low: '#4ade80'
  }
  const bgs: Record<string, string> = {
    high: 'rgba(248,113,113,0.1)', medium: 'rgba(251,191,36,0.1)', low: 'rgba(74,222,128,0.1)'
  }
  return (
    <span style={{
      padding: '2px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600,
      color: colors[priority] || colors.medium,
      background: bgs[priority] || bgs.medium,
      textTransform: 'capitalize'
    }}>{priority}</span>
  )
}

export default function ResultsPage({ data, onBack }: ResultsPageProps) {
  const [copied, setCopied] = useState(false)
  const [showFullText, setShowFullText] = useState(false)

  const copyText = () => {
    navigator.clipboard.writeText(data.extractedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const overallScore = data.engagementScore.overall
  const scoreColor = overallScore >= 70 ? 'var(--green)' : overallScore >= 40 ? 'var(--yellow)' : 'var(--accent2)'
  const scoreLabel = overallScore >= 70 ? 'Great!' : overallScore >= 40 ? 'Good' : 'Needs Work'

  const platformColors: Record<string, string> = {
    instagram: '#e1306c', twitter: '#1da1f2', linkedin: '#0077b5',
    facebook: '#1877f2', general: 'var(--accent)'
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {/* Back button */}
      <button onClick={onBack} className="fade-up" style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '1.5rem',
        fontFamily: 'var(--font-b)', padding: '4px 0'
      }}>
        <ArrowLeft size={16} /> Back to Upload
      </button>

      {/* File info + overall score */}
      <div className="fade-up" style={{
        background: 'var(--card)', borderRadius: '20px',
        border: '1px solid var(--border)',
        padding: '2rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <FileText size={20} color="var(--accent)" />
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '1.2rem', fontWeight: 700 }}>{data.fileName}</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: data.fileType === 'pdf' ? 'PDF Document' : 'Image (OCR)', color: 'var(--accent)' },
              { label: `${data.wordCount} words`, color: 'var(--text2)' },
              { label: `${data.charCount} characters`, color: 'var(--text2)' },
              { label: data.platform.charAt(0).toUpperCase() + data.platform.slice(1), color: platformColors[data.platform] || 'var(--accent)' }
            ].map(({ label, color }) => (
              <span key={label} style={{
                padding: '4px 12px', borderRadius: '100px',
                background: 'var(--card2)', border: '1px solid var(--border)',
                fontSize: '0.8rem', color
              }}>{label}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            background: `conic-gradient(${scoreColor} ${overallScore * 3.6}deg, var(--card2) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 8px', position: 'relative'
          }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: 'var(--card)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-h)', fontSize: '1.3rem', fontWeight: 800, color: scoreColor }}>{overallScore}</span>
            </div>
          </div>
          <div style={{ fontWeight: 600, color: scoreColor, fontSize: '0.9rem' }}>{scoreLabel}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Engagement Score</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Score Breakdown */}
        <div className="fade-up-d1" style={{
          background: 'var(--card)', borderRadius: '20px',
          border: '1px solid var(--border)', padding: '1.5rem'
        }}>
          <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--accent)" /> Score Breakdown
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            <ScoreCircle score={data.engagementScore.readability} label="Readability" color="var(--accent)" />
            <ScoreCircle score={data.engagementScore.hashtags} label="Hashtags" color="var(--accent2)" />
            <ScoreCircle score={data.engagementScore.callToAction} label="CTA" color="var(--green)" />
            <ScoreCircle score={data.engagementScore.sentiment} label="Sentiment" color="var(--yellow)" />
            <ScoreCircle score={data.engagementScore.length} label="Length" color="var(--orange)" />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            {[
              { label: 'Readability', value: data.engagementScore.readability, color: 'var(--accent)' },
              { label: 'Hashtags', value: data.engagementScore.hashtags, color: 'var(--accent2)' },
              { label: 'Call to Action', value: data.engagementScore.callToAction, color: 'var(--green)' },
              { label: 'Sentiment', value: data.engagementScore.sentiment, color: 'var(--yellow)' },
              { label: 'Content Length', value: data.engagementScore.length, color: 'var(--orange)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--text2)' }}>{label}</span>
                  <span style={{ color, fontWeight: 600 }}>{value}/100</span>
                </div>
                <div style={{ height: '5px', borderRadius: '5px', background: 'var(--card2)' }}>
                  <div style={{ height: '100%', width: `${value}%`, borderRadius: '5px', background: color, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Extracted Text */}
          <div className="fade-up-d1" style={{
            background: 'var(--card)', borderRadius: '20px',
            border: '1px solid var(--border)', padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <FileText size={16} color="var(--accent)" /> Extracted Text
              </h3>
              <button onClick={copyText} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'var(--card2)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '5px 12px',
                cursor: 'pointer', color: copied ? 'var(--green)' : 'var(--text2)',
                fontSize: '0.78rem', fontFamily: 'var(--font-b)'
              }}>
                {copied ? <><CheckCheck size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
            <div style={{
              background: 'var(--card2)', borderRadius: '10px', padding: '1rem',
              fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text2)',
              maxHeight: showFullText ? 'none' : '120px', overflow: 'hidden',
              position: 'relative'
            }}>
              {data.extractedText}
              {!showFullText && data.extractedText.length > 200 && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px',
                  background: 'linear-gradient(transparent, var(--card2))'
                }} />
              )}
            </div>
            {data.extractedText.length > 200 && (
              <button onClick={() => setShowFullText(!showFullText)} style={{
                background: 'none', border: 'none', color: 'var(--accent)',
                cursor: 'pointer', fontSize: '0.82rem', marginTop: '6px', fontFamily: 'var(--font-b)'
              }}>
                {showFullText ? 'Show less' : 'Show full text'}
              </button>
            )}
          </div>

          {/* Tags, Mentions, Emojis */}
          <div className="fade-up-d2" style={{
            background: 'var(--card)', borderRadius: '20px',
            border: '1px solid var(--border)', padding: '1.5rem'
          }}>
            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Content Elements</h3>
            {[
              { icon: Hash, label: 'Hashtags', items: data.hashtags, color: 'var(--accent)' },
              { icon: AtSign, label: 'Mentions', items: data.mentions, color: 'var(--accent2)' },
              { icon: Smile, label: 'Emojis', items: data.emojis, color: 'var(--yellow)' },
            ].map(({ icon: Icon, label, items, color }) => (
              <div key={label} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text2)' }}>
                  <Icon size={13} color={color} /> {label} ({items.length})
                </div>
                {items.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {items.slice(0, 10).map((item, i) => (
                      <span key={i} style={{
                        padding: '3px 10px', borderRadius: '100px', fontSize: '0.78rem',
                        background: 'var(--card2)', border: `1px solid ${color}33`, color
                      }}>{item}</span>
                    ))}
                    {items.length > 10 && <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>+{items.length - 10} more</span>}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>None found</span>
                )}
              </div>
            ))}
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text2)' }}>Sentiment:</span>
              <span style={{
                padding: '2px 12px', borderRadius: '100px', fontWeight: 600, fontSize: '0.78rem',
                background: data.sentiment === 'positive' ? 'rgba(74,222,128,0.1)' : data.sentiment === 'negative' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                color: data.sentiment === 'positive' ? 'var(--green)' : data.sentiment === 'negative' ? '#f87171' : 'var(--yellow)',
              }}>{data.sentiment}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="fade-up-d3" style={{
        background: 'var(--card)', borderRadius: '20px',
        border: '1px solid var(--border)', padding: '1.5rem',
        marginTop: '1.5rem'
      }}>
        <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} color="var(--yellow)" /> Engagement Suggestions ({data.suggestions.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {data.suggestions.map((s, i) => (
            <div key={i} style={{
              padding: '1rem', borderRadius: '12px',
              background: 'var(--card2)', border: '1px solid var(--border)',
              transition: 'border-color 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{s.category}</span>
                <PriorityBadge priority={s.priority} />
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.6 }}>{s.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
