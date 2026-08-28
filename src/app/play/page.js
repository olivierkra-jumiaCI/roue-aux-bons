import Wheel from '@/components/Wheel';

export default function PlayPage() {
  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Tournez la Roue !
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#cbd5e1' }}>
        Que la chance soit avec vous !
      </p>
      <Wheel />
    </div>
  );
}
