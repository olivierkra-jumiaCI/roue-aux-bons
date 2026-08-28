'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="container error-msg" style={{ marginTop: '5rem' }}>{error}</div>;
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '900px' }}>
      <h1 className="page-title" style={{ fontSize: '2.5rem' }}>Tableau de Bord</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Total Joueurs</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.totalPlays}</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Gagnants</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>{stats.wins}</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Perdants</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--danger)' }}>{stats.losses}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
          Liste des Gagnants
        </h2>
        
        {stats.winners.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>Aucun gagnant pour le moment.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem', color: '#cbd5e1' }}>Date</th>
                  <th style={{ padding: '1rem', color: '#cbd5e1' }}>Nom</th>
                  <th style={{ padding: '1rem', color: '#cbd5e1' }}>Email</th>
                  <th style={{ padding: '1rem', color: '#cbd5e1' }}>Téléphone</th>
                  <th style={{ padding: '1rem', color: '#cbd5e1' }}>Adresse</th>
                  <th style={{ padding: '1rem', color: '#cbd5e1' }}>Code Bon</th>
                </tr>
              </thead>
              <tbody>
                {stats.winners.map((winner, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>{new Date(winner.Date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>{winner.Name}</td>
                    <td style={{ padding: '1rem' }}>{winner.Email}</td>
                    <td style={{ padding: '1rem' }}>{winner.Phone}</td>
                    <td style={{ padding: '1rem' }}>{winner.Address}</td>
                    <td style={{ padding: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>{winner['Voucher Code']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
