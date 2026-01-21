import { useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';

const Upload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage({ type: '', text: '' });
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first.' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming backend runs on port 8000
      await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({ type: 'success', text: 'Data uploaded successfully!' });
      setFile(null);
      // Reset file input value
      document.getElementById('file-upload').value = '';
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Upload Student Data</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '500px' }}>
        Upload a CSV file containing student marks. The system will automatically process and visualize the performance data.
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center', 
        width: '100%', 
        justifyContent: 'center',
        marginTop: '1rem' 
      }}>
        <input 
          id="file-upload"
          type="file" 
          accept=".csv"
          onChange={handleFileChange}
          style={{
            padding: '0.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--card-border)',
            borderRadius: '6px',
            color: 'var(--text-primary)'
          }}
        />
        <button 
          className="btn-primary" 
          onClick={handleUpload}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>

      {message.text && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(35, 134, 54, 0.2)' : 'rgba(218, 54, 51, 0.2)',
          border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--error)'}`,
          color: message.type === 'success' ? '#3fb950' : '#f85149',
          animation: 'fadeIn 0.3s ease'
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Upload;
