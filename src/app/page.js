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
    <div className="animate-fade-in" style={{ maxWidth: '500px', margin: '0 auto', marginTop: '10vh' }}>
      <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        La Roue aux Bons
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#cbd5e1' }}>
        Tentez votre chance de gagner un bon de 10 000 FCFA !
      </p>

      {availableVouchers === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', borderColor: 'var(--danger)' }}>
          <h2 style={{ color: '#fca5a5', marginBottom: '1rem' }}>Oups !</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
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
