'use client';

import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './wheel.css';

const segments = [
  { text: "BON D'ACHAT", isWinner: true },
  { text: 'REJOUEZ', isWinner: false },
  { text: "BON D'ACHAT", isWinner: true },
  { text: 'REJOUEZ', isWinner: false },
  { text: "BON D'ACHAT", isWinner: true },
  { text: 'REJOUEZ', isWinner: false }
];

export default function Wheel({ onSpinComplete }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const wheelRef = useRef(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem('joueur');
    if (userStr) {
      setPlayerInfo(JSON.parse(userStr));
    } else {
      // Redirect to login page if no player info is found
      window.location.href = '/';
    }
    
    return () => {
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none';
      }
    };
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f68b1e', '#8b5cf6', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f68b1e', '#8b5cf6', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    try {
      if (!playerInfo) {
        alert("Erreur de session. Veuillez vous reconnecter.");
        window.location.href = '/';
        return;
      }

      const isWin = Math.random() < 0.3;
      const resultAction = isWin ? 'Win' : 'Loss';

      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...playerInfo, result: resultAction })
      });
      const data = await res.json();

      if (data.error) {
        alert("Erreur: " + data.error);
        setIsSpinning(false);
        return;
      }

      const spins = 5;
      const baseRotation = spins * 360;
      
      const targetSegments = segments
        .map((seg, idx) => ({ ...seg, originalIndex: idx }))
        .filter(seg => seg.isWinner === isWin);
      
      const winningSegment = targetSegments[Math.floor(Math.random() * targetSegments.length)];
      const sliceAngle = 360 / segments.length;
      const stopAngle = 360 - (winningSegment.originalIndex * sliceAngle);
      const randomOffset = Math.floor(Math.random() * 40) - 20;
      
      const finalRotation = rotationAngle + baseRotation + stopAngle + randomOffset;
      setRotationAngle(finalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        setResultData({
          isWinner: isWin,
          voucher: data.voucher
        });
        setShowResultModal(true);
        if (isWin) triggerConfetti();
        
        if(onSpinComplete) onSpinComplete({ isWinner: isWin, voucher: data.voucher });
      }, 4000);

    } catch (error) {
      console.error("Spin error:", error);
      alert("Une erreur est survenue.");
      setIsSpinning(false);
    }
  };

  return (
    <>
      <div className="wheel-section">
        <div className="wheel-container">
          <div className="wheel-wrapper">
            <div className="pointer"></div>
            <div 
              className="wheel-svg-container"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.1, 1)' : 'none'
              }}
            >
              <svg viewBox="0 0 340 340" width="100%" height="100%">
                <g transform="translate(170, 170)">
                  {segments.map((segment, index) => {
                    const angle = index * 60;
                    return (
                      <g key={index} transform={`rotate(${angle})`}>
                        <path 
                          d="M 0 0 L -85 -147.22 A 170 170 0 0 1 85 -147.22 Z" 
                          fill={segment.isWinner ? '#8b5cf6' : '#f68b1e'} 
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text 
                          x="0" 
                          y="-95" 
                          textAnchor="middle" 
                          alignmentBaseline="middle" 
                          fill="#ffffff"
                          fontSize="18"
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
              disabled={isSpinning || showResultModal}
            >
              ⭐
            </button>
          </div>
          <div className="wheel-stand"></div>
          <div className="wheel-stand-base"></div>
        </div>
      </div>

      {showResultModal && resultData && (
        <div className="modal-overlay animate-fade-in">
          <div className={`glass-panel result-panel animate-pop ${resultData.isWinner ? 'winner' : ''}`}>
            {resultData.isWinner ? (
              <>
                <h2 className="win-title">Félicitations !</h2>
                <div className="emoji-lg">🎁</div>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Bravo {playerInfo?.name} ! Vous gagnez un bon d'achat.
                </p>
                <div className="voucher-card">
                  <div className="voucher-code">{resultData.voucher?.code}</div>
                  <div className="voucher-terms">
                    Valeur : {resultData.voucher?.value}<br/>
                    Valable pour un minimum d'achat de 30 000 FCFA.
                  </div>
                </div>
                <p className="success-msg">
                  N'oubliez pas d'utiliser le code pour passer votre commande !
                </p>
              </>
            ) : (
              <>
                <h2 className="lose-title">Oups...</h2>
                <div className="emoji-lg">🥺</div>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                  Vous n'avez pas gagné cette fois-ci.<br/>
                  Merci pour votre participation {playerInfo?.name}.<br/>
                  Revenez demain pour retenter votre chance !
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
