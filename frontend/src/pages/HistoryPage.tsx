import { useEffect, useState } from 'react'
import { Clock, FileText, Image, Trash2, Eye, TrendingUp, AlertCircle, Loader2 } from 'lucide-react'
import { getHistory, deleteAnalysis, getAnalysisById } from '../utils/api'
import type { AnalysisData } from '../App'

interface HistoryPageProps {
  onViewAnalysis: (data: AnalysisData) => void
}

export default function HistoryPage({ onViewAnalysis }: HistoryPageProps) {
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const result = await getHistory()
      setAnalyses(result.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this analysis?')) return
    setDeleting(id)
    try {
      await deleteAnalysis(id)
      setAnalyses(prev => prev.filter(a => a._id !== id))
    } catch (err) {
      alert('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const handleView = async (id: string) => {
    try {
      const result = await getAnalysisById(id)
      onViewAnalysis(result.data)
    } catch (err) {
      alert('Failed to load analysis')
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'var(--green)'
    if (score >= 40) return 'var(--yellow)'
    return 'var(--accent2)'
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div className="fade-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-h)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={24} color="var(--accent)" /> Analysis History
        </h1>
        <p style={{ color: 'var(--text2)' }}>View and manage all your past content analyses</p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p>Loading history...</p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '1rem 1.25rem', borderRadius: '12px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && analyses.length === 0 && (
        <div className="fade-up" style={{
          textAlign: 'center', padding: '5rem 2rem',
          background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '0.5rem' }}>No analyses yet</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Upload a file to get started!</p>
        </div>
      )}

      {!loading && analyses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {analyses.map((analysis, i) => (
            <div key={analysis._id} className="fade-up" style={{
              background: 'var(--card)', borderRadius: '16px',
              border: '1px solid var(--border)', padding: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              flexWrap: 'wrap',
              animationDelay: `${i * 0.05}s`
            }}>
              {/* Icon */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: analysis.fileType === 'pdf' ? 'rgba(124,111,255,0.1)' : 'rgba(255,107,157,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {analysis.fileType === 'pdf'
                  ? <FileText size={20} color="var(--accent)" />
                  : <Image size={20} color="var(--accent2)" />
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontWeight: 600, marginBottom: '3px', fontSize: '0.95rem' }}>
                  {analysis.fileName}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    {formatDate(analysis.createdAt)}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>
                    {analysis.wordCount} words
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: '100px', fontSize: '0.72rem',
                    background: analysis.sentiment === 'positive' ? 'rgba(74,222,128,0.1)' : analysis.sentiment === 'negative' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                    color: analysis.sentiment === 'positive' ? 'var(--green)' : analysis.sentiment === 'negative' ? '#f87171' : 'var(--yellow)',
                  }}>{analysis.sentiment}</span>
                </div>
              </div>

              {/* Score */}
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={14} color={getScoreColor(analysis.engagementScore?.overall || 0)} />
                  <span style={{
                    fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-h)',
                    color: getScoreColor(analysis.engagementScore?.overall || 0)
                  }}>
                    {analysis.engagementScore?.overall || 0}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>score</div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleView(analysis._id)} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '7px 14px', borderRadius: '8px',
                  background: 'rgba(124,111,255,0.1)',
                  border: '1px solid rgba(124,111,255,0.2)',
                  color: 'var(--accent)', cursor: 'pointer',
                  fontSize: '0.82rem', fontFamily: 'var(--font-b)', fontWeight: 500
                }}>
                  <Eye size={14} /> View
                </button>
                <button onClick={() => handleDelete(analysis._id)} disabled={deleting === analysis._id} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '7px 14px', borderRadius: '8px',
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  color: '#f87171', cursor: deleting === analysis._id ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem', fontFamily: 'var(--font-b)', fontWeight: 500
                }}>
                  {deleting === analysis._id
                    ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    : <Trash2 size={14} />
                  }
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
