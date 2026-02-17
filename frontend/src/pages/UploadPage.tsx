import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Image, AlertCircle, Loader2, Zap } from 'lucide-react'
import { analyzeFile } from '../utils/api'
import type { AnalysisData } from '../App'

interface UploadPageProps {
  onAnalysisComplete: (data: AnalysisData) => void
}

export default function UploadPage({ onAnalysisComplete }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  })

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      setProgress(file.type === 'application/pdf' ? 'Extracting text from PDF...' : 'Running OCR on image...')
      const result = await analyzeFile(file)
      setProgress('Analyzing engagement...')
      setTimeout(() => {
        onAnalysisComplete(result.data)
        setLoading(false)
        setFile(null)
        setProgress('')
      }, 500)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze file. Please try again.')
      setLoading(false)
      setProgress('')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    /* ── Full-page wrapper with dreamy gradient + grain ── */
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>

      {/* Layer 1 – gradient */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(160deg, #8ACFEB 0%, #E5EAF5 25%, #D0B0F5 50%, #9456B3 75%, #494D5F 100%)',
        zIndex: 0
      }} />

      {/* Layer 2 – grain/noise texture */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '180px 180px',
        mixBlendMode: 'overlay',
        opacity: 0.45,
        zIndex: 1
      }} />

      {/* Layer 3 – content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '860px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Hero */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.25)',
            border: '1px solid rgba(255,255,255,0.45)',
            backdropFilter: 'blur(8px)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem', color: '#3a1a6e', fontWeight: 600
          }}>
            <Zap size={14} /> AI-Powered Content Analysis
          </div>
          <h1 style={{
            fontFamily: 'var(--font-h)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: '#1a0533',
            textShadow: '0 2px 20px rgba(148,86,179,0.2)'
          }}>
            Optimize Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #9456B3, #494D5F)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Social Content
            </span>
          </h1>
          <p style={{ color: '#3b2060', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', fontWeight: 400 }}>
            Upload your social media posts as PDFs or images. We'll extract the text, analyze engagement potential, and suggest improvements.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="fade-up-d1">
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#9456B3' : file ? '#4ade80' : 'rgba(255,255,255,0.5)'}`,
              borderRadius: '24px',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: isDragActive
                ? 'rgba(148,86,179,0.15)'
                : file
                ? 'rgba(74,222,128,0.1)'
                : 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(73,77,95,0.15)',
              animation: isDragActive ? 'borderGlow 2s infinite' : 'none'
            }}
          >
            <input {...getInputProps()} />

            {!file ? (
              <>
                <div style={{
                  width: '72px', height: '72px',
                  borderRadius: '18px',
                  background: isDragActive ? 'rgba(148,86,179,0.25)' : 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  border: '1px solid rgba(255,255,255,0.4)',
                  transition: 'all 0.3s'
                }}>
                  <Upload size={32} color={isDragActive ? '#9456B3' : '#3b2060'} />
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a0533' }}>
                  {isDragActive ? 'Drop your file here!' : 'Drag & drop your file here'}
                </p>
                <p style={{ color: '#3b2060', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  or click to browse your files
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { icon: FileText, label: 'PDF Files', desc: 'Text extraction' },
                    { icon: Image, label: 'Images', desc: 'OCR processing' }
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.3)',
                      border: '1px solid rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(8px)',
                      fontSize: '0.85rem'
                    }}>
                      <Icon size={16} color="#9456B3" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1a0533' }}>{label}</div>
                        <div style={{ color: '#3b2060', fontSize: '0.75rem' }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ color: '#4a3070', fontSize: '0.8rem', marginTop: '1rem' }}>
                  Max file size: 10MB
                </p>
              </>
            ) : (
              <div>
                <div style={{
                  width: '64px', height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(74,222,128,0.2)',
                  border: '1px solid rgba(74,222,128,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  {file.type === 'application/pdf'
                    ? <FileText size={28} color="#16a34a" />
                    : <Image size={28} color="#16a34a" />
                  }
                </div>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px', color: '#1a0533' }}>{file.name}</p>
                <p style={{ color: '#3b2060', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {file.type === 'application/pdf' ? 'PDF Document' : 'Image File'} • {formatSize(file.size)}
                </p>
                <p style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>✓ File ready for analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="fade-up" style={{
            marginTop: '1rem',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            color: '#7f1d1d'
          }}>
            <AlertCircle size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="fade-up-d2" style={{ marginTop: '1.5rem', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {file && !loading && (
            <button
              onClick={() => { setFile(null); setError(null); }}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                color: '#3b2060',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-b)',
                fontWeight: 500
              }}
            >
              Remove
            </button>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            style={{
              padding: '12px 32px',
              borderRadius: '12px',
              border: 'none',
              background: !file || loading
                ? 'rgba(255,255,255,0.2)'
                : 'linear-gradient(135deg, #9456B3, #494D5F)',
              color: !file || loading ? 'rgba(58,26,110,0.5)' : 'white',
              cursor: !file || loading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'var(--font-h)',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s',
              minWidth: '160px',
              justifyContent: 'center',
              boxShadow: !file || loading ? 'none' : '0 4px 20px rgba(148,86,179,0.4)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                {progress || 'Analyzing...'}
              </>
            ) : (
              <>
                <Zap size={18} />
                Analyze Now
              </>
            )}
          </button>
        </div>

        {/* Features */}
        <div className="fade-up-d3" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '3rem'
        }}>
          {[
            { emoji: '📄', title: 'PDF Parsing', desc: 'Extract text from PDF documents with formatting preserved' },
            { emoji: '🔍', title: 'OCR Technology', desc: 'Read text from images and scanned documents automatically' },
            { emoji: '📊', title: 'Engagement Score', desc: 'Get a detailed engagement score across 5 key metrics' },
            { emoji: '💡', title: 'AI Suggestions', desc: 'Receive actionable tips to improve your content performance' }
          ].map(({ emoji, title, desc }) => (
            <div key={title} style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.35)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 16px rgba(73,77,95,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: '#1a0533' }}>{title}</div>
              <div style={{ color: '#3b2060', fontSize: '0.82rem', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}