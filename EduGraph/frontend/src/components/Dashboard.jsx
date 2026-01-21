import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#58a6ff', '#bc8cff', '#3fb950', '#f85149', '#d29922', '#8b949e'];

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchPerformance(selectedStudent.id);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:8000/students');
      setStudents(res.data);
      if (res.data.length > 0 && !selectedStudent) {
        setSelectedStudent(res.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students", error);
      setLoading(false);
    }
  };

  const fetchPerformance = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/students/${id}`);
      setPerformanceData(res.data);
    } catch (error) {
      console.error("Error fetching performance", error);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</div>;
  }

  if (students.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No data available. Please upload a CSV file.</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%', flexDirection: 'column' }}>
      
      {/* Filters / Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
        <h3 style={{ margin: 0, whiteSpace: 'nowrap' }}>Select Student:</h3>
        <select 
          style={{
            padding: '0.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--card-border)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            minWidth: '200px'
          }}
          value={selectedStudent?.id || ''}
          onChange={(e) => {
            const student = students.find(s => s.id === parseInt(e.target.value));
            setSelectedStudent(student);
          }}
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.student_id_csv})</option>
          ))}
        </select>
      </div>

      {performanceData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Stats? */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
             <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(88, 166, 255, 0.1)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Marks</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {performanceData.scores.reduce((acc, curr) => acc + curr.marks, 0)}
                </div>
             </div>
             <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(188, 140, 255, 0.1)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Average Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {(performanceData.scores.reduce((acc, curr) => acc + curr.marks, 0) / performanceData.scores.length).toFixed(1)}%
                </div>
             </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            
            {/* Bar Chart */}
            <div className="glass-card" style={{ padding: '1.5rem', minHeight: '400px' }}>
              <h4 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Subject-wise Performance</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData.scores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="subject" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
                    itemStyle={{ color: '#f0f6fc' }}
                  />
                  <Bar dataKey="marks" fill="#58a6ff" radius={[4, 4, 0, 0]}>
                    {performanceData.scores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="glass-card" style={{ padding: '1.5rem', minHeight: '400px' }}>
              <h4 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Score Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData.scores}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="marks"
                    nameKey="subject"
                  >
                    {performanceData.scores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                     contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
                     itemStyle={{ color: '#f0f6fc' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
