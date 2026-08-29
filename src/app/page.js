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
      {availableVouchers === 0 ? (
        <div style={{ 
          background: '#e11d48', 
          border: '6px solid #ffffff',
          borderRadius: '12px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          boxShadow: '0 15px 35px rgba(225, 29, 72, 0.4)',
          transform: 'rotate(-2deg)'
        }}>
          <h2 style={{ 
            color: '#ffffff', 
            marginBottom: '1rem', 
            fontSize: '3.5rem', 
            fontWeight: '900',
            textTransform: 'uppercase',
            lineHeight: '1'
          }}>
            STOCK ÉPUISÉ !
          </h2>
          <p style={{ 
            fontSize: '1.3rem', 
            lineHeight: '1.4', 
            color: '#ffffff',
            fontWeight: '700'
          }}>
            Tous les bons du jour ont été dévalisés !<br />
            <span style={{ 
              display: 'inline-block', 
              background: '#ffb703', 
              color: '#282828', 
              padding: '0.8rem 1.5rem', 
              borderRadius: '50px', 
              marginTop: '1.5rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              Revenez dès demain ! 🏃‍♂️
            </span>
          </p>
        </div>
      ) : (
        <>
          <h1 className="page-title">
            Roue <span>Aux</span><br/>coupons
          </h1>
          <p style={{ textAlign: 'center', margin: '2rem 0', color: '#ffffff', fontSize: '1.2rem', fontWeight: '500' }}>
            Inscrivez-vous pour tenter de gagner un bon de réduction !
          </p>
          <LoginForm />
        </>
      )}
    </div>
  );
}
