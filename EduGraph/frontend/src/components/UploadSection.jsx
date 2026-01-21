import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadData } from '../api';

const UploadSection = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);

    try {
      await uploadData(file);
      setMessage({ type: 'success', text: 'Data uploaded successfully!' });
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to process file. Ensure it is a valid CSV.' });
    } finally {
      setLoading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Update Dataset</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          Upload a new CSV file to verify student performance.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" size={18} />
            <span style={{ fontSize: '0.9rem' }}>Processing...</span>
          </div>
        )}

        {message && !loading && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '0.9rem',
            color: message.type === 'success' ? 'var(--success)' : 'var(--error)'
          }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <label className="btn btn-primary" style={{ position: 'relative', overflow: 'hidden' }}>
          <UploadCloud size={18} />
          <span>Upload CSV</span>
          <input 
            type="file" 
            accept=".csv"
            onChange={handleFileChange}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              opacity: 0, 
              cursor: 'pointer' 
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default UploadSection;
