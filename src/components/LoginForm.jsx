'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      if (data.hasPlayed) {
        setAlreadyPlayed(true);
      } else {
        // Save user info to sessionStorage for the game page
        sessionStorage.setItem('playerInfo', JSON.stringify(formData));
        router.push('/play');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (alreadyPlayed) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#fca5a5', marginBottom: '1rem' }}>Déjà joué !</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
          Vous avez déjà tourné la roue aujourd'hui.<br />
          Revenez encore demain pour demain !
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Nom complet</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Jean Dupont"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Adresse Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jean@exemple.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Numéro de téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+225 0102030405"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="address">Adresse de livraison</label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-input"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Abidjan, Cocody..."
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Vérification...' : 'Jouer maintenant'}
        </button>
      </form>
    </div>
  );
}
