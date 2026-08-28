import Wheel from '@/components/Wheel';

export default function PlayPage() {
  return (
    <div className="hero-container animate-fade-in">
      <div className="hero-text-section" style={{ textAlign: 'center' }}>
        <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Tournez la roue !
        </h1>
      </div>
      
      <Wheel />
    </div>
  );
}
