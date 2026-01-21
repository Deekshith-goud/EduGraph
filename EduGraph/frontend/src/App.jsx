import { useState } from 'react';
import Navbar from './components/Navbar';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1); // Trigger dashboard refresh
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container">
        <UploadSection onUploadSuccess={handleUploadSuccess} />
        <Dashboard refreshTrigger={refreshKey} />
      </main>
    </div>
  );
}

export default App;
