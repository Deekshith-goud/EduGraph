import { useState } from 'react'
import Upload from './components/Upload'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [dataRevalidation, setDataRevalidation] = useState(0);

  const handleUploadSuccess = () => {
    setDataRevalidation(prev => prev + 1);
  };

  return (
    <div className="container-wrapper">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(90deg, #58a6ff, #bc8cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0' }}>
          EduGraph
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Advanced Student Performance Analytics
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section className="glass-card" style={{ padding: '2rem' }}>
          <Upload onUploadSuccess={handleUploadSuccess} />
        </section>

        <section className="glass-card" style={{ padding: '2rem', flex: 1, minHeight: '600px' }}>
          <Dashboard key={dataRevalidation} />
        </section>
      </main>
    </div>
  )
}

export default App
