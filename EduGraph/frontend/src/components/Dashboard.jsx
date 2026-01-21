import { useState, useEffect } from 'react';
import { fetchStudents } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { User, BookOpen, Trophy } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#6366f1'];

const Dashboard = ({ refreshTrigger }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchStudents();
      setStudents(res.data);
      if (res.data.length > 0) {
        // Keep selected if exists and still valid, else select first
        setSelectedStudent(prev => {
          if (prev && res.data.find(s => s.id === prev.id)) {
            return res.data.find(s => s.id === prev.id);
          }
          return res.data[0];
        });
      } else {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading analytics...</div>;
  
  if (students.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>No Data Available</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Please upload a CSV file to get started.</p>
      </div>
    );
  }

  const scores = selectedStudent ? selectedStudent.scores : [];
  const totalMarks = scores.reduce((sum, item) => sum + item.marks, 0);
  const averageMarks = scores.length > 0 ? (totalMarks / scores.length).toFixed(1) : 0;

  return (
    <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      
      {/* Selector */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <User size={20} color="var(--primary)" />
        <span style={{ fontWeight: '500' }}>Select Student:</span>
        <select 
          value={selectedStudent?.id || ''}
          onChange={(e) => setSelectedStudent(students.find(s => s.id === parseInt(e.target.value)))}
          style={{
            background: 'var(--bg-dark)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            minWidth: '250px',
            fontSize: '1rem'
          }}
        >
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name} (ID: {student.student_csv_id})
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Score</span>
            <Trophy size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalMarks}</div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average Percentage</span>
            <BookOpen size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{averageMarks}%</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
        
        {/* Bar Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Subject Performance</h3>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={scores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="subject" stroke="#a1a1aa" tick={{fontSize: 12}} />
                <YAxis stroke="#a1a1aa" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fafafa' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Bar dataKey="marks" radius={[4, 4, 0, 0]}>
                  {scores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Distribution Analysis</h3>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={scores}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={4}
                  dataKey="marks"
                  nameKey="subject"
                  stroke="none"
                >
                  {scores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fafafa' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
