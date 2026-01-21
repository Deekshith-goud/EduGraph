import { BarChart3 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{ 
      borderBottom: '1px solid var(--border)', 
      padding: '1rem 0',
      marginBottom: '2rem',
      background: 'rgba(24, 24, 27, 0.8)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 2rem' }}>
        <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
          <BarChart3 size={24} color="var(--primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>EduGraph</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Performance Analytics</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
