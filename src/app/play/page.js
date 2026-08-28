import Wheel from '@/components/Wheel';

export default function PlayPage() {
  return (
    <div className="hero-container animate-fade-in">
      <div className="hero-text-section">
        <h1 className="page-title">
          Roue <span>Aux</span><br/>coupons
        </h1>
        <h2 className="page-subtitle">
          Des bons<br/>de réduction<br/>à gogo !
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#fff', opacity: 0.9 }}>
          Offre soumise à condition
        </p>
      </div>
      
      <Wheel />
    </div>
  );
}
