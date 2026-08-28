'use client';

import { useState, useRef, useEffect } from 'react';
import './wheel.css';

const segments = [
  { text: '10 000 FCFA', isWinner: true },
  { text: 'Dommage', isWinner: false },
  { text: '10 000 FCFA', isWinner: true },
  { text: 'Perdu', isWinner: false },
  { text: '10 000 FCFA', isWinner: true },
  { text: 'Pas de chance', isWinner: false }
];

export default function Wheel({ onSpinComplete }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const wheelRef = useRef(null);

  // Clean up any stray classes on unmount
  useEffect(() => {
    return () => {
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none';
      }
    };
  }, []);

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    try {
      // Fetch result from backend
      const userStr = sessionStorage.getItem('joueur');
      if (!userStr) {
        alert("Erreur de session. Veuillez vous reconnecter.");
        window.location.href = '/';
        return;
      }
      const user = JSON.parse(userStr);

      // Randomly determine win or lose (50% chance)
      const isWin = Math.random() > 0.5;
      const resultAction = isWin ? 'Win' : 'Loss';

      // Record spin
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, result: resultAction })
      });
      const data = await res.json();

      if (data.error) {
        alert("Erreur: " + data.error);
        setIsSpinning(false);
        return;
      }

      // Calculate rotation
      const spins = 5; // Minimum 5 full spins
      const baseRotation = spins * 360;
      
      // Determine target segment
      const targetSegments = segments
        .map((seg, idx) => ({ ...seg, originalIndex: idx }))
        .filter(seg => seg.isWinner === isWin);
      
      const winningSegment = targetSegments[Math.floor(Math.random() * targetSegments.length)];
      
      // Calculate angle to land on the winning segment
      const sliceAngle = 360 / segments.length;
      // The pointer is at 0 degrees (top). We need the segment to land at 0 degrees.
      // Segment N is drawn at (N * 60) degrees. So we rotate by -(N * 60).
      const stopAngle = 360 - (winningSegment.originalIndex * sliceAngle);
      
      // Add random offset inside the slice to make it look natural (-20 to +20 degrees)
      const randomOffset = Math.floor(Math.random() * 40) - 20;
      
      const finalRotation = rotationAngle + baseRotation + stopAngle + randomOffset;
      setRotationAngle(finalRotation);

      // Wait for animation to finish (4 seconds)
      setTimeout(() => {
        setIsSpinning(false);
        onSpinComplete({
          isWinner: isWin,
          voucher: data.voucher
        });
      }, 4000);

    } catch (error) {
      console.error("Spin error:", error);
      alert("Une erreur est survenue.");
      setIsSpinning(false);
    }
  };

  return (
    <div className="wheel-container">
      <div className="wheel-wrapper">
        <div className="pointer"></div>
        <div 
          className="wheel-svg-container"
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
          }}
        >
          <svg viewBox="0 0 340 340" width="100%" height="100%">
            <g transform="translate(170, 170)">
              {segments.map((segment, index) => {
                const angle = index * 60;
                return (
                  <g key={index} transform={`rotate(${angle})`}>
                    {/* 60-degree slice path (-30 to +30 degrees) */}
                    <path 
                      d="M 0 0 L -85 -147.22 A 170 170 0 0 1 85 -147.22 Z" 
                      fill={segment.isWinner ? '#f68b1e' : '#ffffff'} 
                      stroke="#282828"
                      strokeWidth="2"
                    />
                    {/* Text rotated to follow radius */}
                    <text 
                      x="0" 
                      y="-95" 
                      textAnchor="middle" 
                      alignmentBaseline="middle" 
                      fill={segment.isWinner ? '#ffffff' : '#282828'}
                      fontSize="17"
                      fontWeight="900"
                      transform="rotate(90 0 -95)"
                    >
                      {segment.text}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        <button 
          className="spin-button" 
          onClick={spin}
          disabled={isSpinning}
        >
          Tourner
        </button>
      </div>
    </div>
  );
}
