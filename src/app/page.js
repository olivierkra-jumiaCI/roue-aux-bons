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
        <div className="glass-panel" style={{ textAlign: 'center', borderColor: '#fee2e2' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '2rem', fontWeight: '900' }}>Oups !</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#282828' }}>
            Désolé, tous les bons du jour ont été gagnés !<br />
            Revenez demain pour une nouvelle chance.
          </p>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
