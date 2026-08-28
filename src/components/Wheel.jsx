'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './wheel.css'; // We'll create this next

const segments = [
  { text: '10 000 FCFA', color: '#10b981', isWinner: true },
  { text: 'Dommage', color: '#ef4444', isWinner: false },
  { text: '10 000 FCFA', color: '#3b82f6', isWinner: true },
  { text: 'Perdu', color: '#ef4444', isWinner: false },
  { text: '10 000 FCFA', color: '#f59e0b', isWinner: true },
  { text: 'Pas de chance', color: '#ef4444', isWinner: false }
];

export default function Wheel() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [error, setError] = useState('');
  const wheelRef = useRef(null);
  const currentRotation = useRef(0);

  useEffect(() => {
    const info = sessionStorage.getItem('playerInfo');
    if (!info) {
      router.push('/');
    } else {
      setPlayerInfo(JSON.parse(info));
    }
  }, [router]);

  const spin = async () => {
    if (isSpinning || result || !playerInfo) return;
    setIsSpinning(true);
    setError('');

    // Pre-determine winner vs loser before spinning so we can land on the right slice
    // Randomly pick an index
    const targetIndex = Math.floor(Math.random() * segments.length);
    const targetSegment = segments[targetIndex];
    
    // Calculate rotation
    const sliceAngle = 360 / segments.length;
    // We want the target segment to land at the top (0 degrees).
    // Segment 0 is at 0 to 60. Center is 30.
    // The top pointer is at -90 degrees relative to standard circle (or depends on CSS).
    // Let's rely on standard CSS rotation where 0 is top.
    
    const spins = 5; // number of full rotations
    const targetAngle = spins * 360 + (360 - (targetIndex * sliceAngle));
    
    // Adjust slightly so it doesn't land perfectly on the line
    const offset = Math.floor(Math.random() * (sliceAngle - 10)) + 5; 
    const finalRotation = currentRotation.current + targetAngle - offset;
    
    currentRotation.current = finalRotation;
    
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)';
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }

    // Wait for animation to finish
    setTimeout(async () => {
      setIsSpinning(false);
      
      try {
        const res = await fetch('/api/spin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...playerInfo,
            result: targetSegment.isWinner ? 'Win' : 'Loss'
          }),
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Erreur lors de l'enregistrement");
        }

        setResult({
          isWinner: targetSegment.isWinner,
          voucher: data.voucher
        });
      } catch (err) {
        setError(err.message);
      }
    }, 4000);
  };

  if (!playerInfo) return null;

  return (
    <div className="wheel-container">
      {error && <div className="error-msg">{error}</div>}
      
      {!result ? (
        <div className="wheel-wrapper">
          <div className="pointer"></div>
          <div className="wheel" ref={wheelRef}>
            {segments.map((segment, index) => {
              const rotation = (360 / segments.length) * index;
              return (
                <div 
                  key={index} 
                  className="segment" 
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    backgroundColor: segment.color
                  }}
                >
                  <span className="segment-text">{segment.text}</span>
                </div>
              );
            })}
          </div>
          
          <button 
            className="btn-accent spin-button" 
            onClick={spin}
            disabled={isSpinning}
          >
            {isSpinning ? '...' : 'Tourner'}
          </button>
        </div>
      ) : (
        <div className="glass-panel animate-fade-in text-center result-panel">
          {result.isWinner ? (
            <>
              <h2 className="win-title">Félicitations {playerInfo.name} !</h2>
              <div className="confetti">🎉</div>
              <p>Vous avez gagné un bon d'achat de <strong>10 000 FCFA</strong> !</p>
              <div className="voucher-card">
                <p className="voucher-code">{result.voucher?.code || 'ERR_CODE'}</p>
                <p className="voucher-terms">Valide pour une commande minimum de 30 000 FCFA, jusqu'au 31 Août.</p>
              </div>
              <p className="success-msg">Votre bon a été enregistré et vous sera envoyé !</p>
            </>
          ) : (
            <>
              <h2 className="lose-title">Oups...</h2>
              <div className="sad-face">😢</div>
              <p>Vous n'avez pas gagné cette fois-ci.</p>
              <p>Merci pour votre participation {playerInfo.name}. Revenez demain pour retenter votre chance !</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
