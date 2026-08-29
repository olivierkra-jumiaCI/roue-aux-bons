import LoginForm from '@/components/LoginForm';
import { getAvailableVouchersCount } from '@/lib/googleSheets';

// Disable caching for this page so it always checks live counts
export const dynamic = 'force-dynamic';

export default async function Home() {
  let availableVouchers = 0;
  
  try {
    availableVouchers = await getAvailableVouchersCount();
  } catch (error) {
    console.error("Failed to fetch voucher count on load", error);
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '10vh', textAlign: 'center', padding: '0 1rem' }}>
      <h1 className="page-title">
        Roue <span>Aux</span><br/>coupons
      </h1>
      <p style={{ textAlign: 'center', margin: '2rem 0', color: '#ffffff', fontSize: '1.2rem', fontWeight: '500' }}>
        Inscrivez-vous pour tenter de gagner un bon de réduction !
      </p>

      {availableVouchers === 0 ? (
        <div style={{ 
          background: '#111315', 
          border: '4px solid #ef4444',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(239, 68, 68, 0.4), inset 0 0 30px rgba(239, 68, 68, 0.2)',
          transform: 'scale(1.05)',
          animation: 'pulseGlow 2s infinite'
        }}>
          <h2 style={{ 
            color: '#ef4444', 
            marginBottom: '1rem', 
            fontSize: '3.5rem', 
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
          }}>
            🚨 STOCK ÉPUISÉ !
          </h2>
          <p style={{ 
            fontSize: '1.5rem', 
            lineHeight: '1.5', 
            color: '#ffffff',
            fontWeight: '800',
            textTransform: 'uppercase'
          }}>
            Tous les bons du jour ont été dévalisés !<br />
            <span style={{ color: '#fb8500', fontSize: '1.8rem', display: 'block', marginTop: '1rem' }}>
              Soyez plus rapide demain ! ⚡
            </span>
          </p>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
