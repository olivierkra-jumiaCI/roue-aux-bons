'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Non renseignée'
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
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data.hasPlayed) {
        setAlreadyPlayed(true);
      } else {
        // Save user info for the game page
        sessionStorage.setItem('joueur', JSON.stringify(formData));
        
        // Redirect to play page
        router.push('/play');
      }

    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  if (alreadyPlayed) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: '900' }}>Déjà joué !</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#282828' }}>
          Vous avez déjà tourné la roue aujourd'hui.<br />
          Revenez encore demain pour une nouvelle chance !
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#f68b1e', fontSize: '1.8rem', fontWeight: '900' }}>
        Connexion
      </h2>
      
      {error && <div className="error-msg animate-fade-in">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Nom Complet</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            required
            value={formData.name}
            onChange={handleChange}
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
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">Numéro de Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Vérification...' : 'Continuer'}
        </button>
      </form>
    </div>
  );
}
