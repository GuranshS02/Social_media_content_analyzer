import { useState } from 'react'
import Header from './components/Header'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'

export type Page = 'upload' | 'results' | 'history'

export interface AnalysisData {
  id: string
  fileName: string
  fileType: string
  extractedText: string
  wordCount: number
  charCount: number
  hashtags: string[]
  mentions: string[]
  emojis: string[]
  sentiment: string
  platform: string
  engagementScore: {
    overall: number
    readability: number
    hashtags: number
    callToAction: number
    sentiment: number
    length: number
  }
  suggestions: Array<{
    category: string
    suggestion: string
    priority: string
  }>
  createdAt: string
}

export default function App() {
  const [page, setPage] = useState<Page>('upload')
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data)
    setPage('results')
  }

  const handleViewHistory = (data: AnalysisData) => {
    setAnalysisData(data)
    setPage('results')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header currentPage={page} onNavigate={setPage} />
      <main>
        {page === 'upload' && (
          <UploadPage onAnalysisComplete={handleAnalysisComplete} />
        )}
        {page === 'results' && analysisData && (
          <ResultsPage
            data={analysisData}
            onBack={() => setPage('upload')}
          />
        )}
        {page === 'history' && (
          <HistoryPage
            onViewAnalysis={handleViewHistory}
          />
        )}
      </main>
    </div>
  )
}
