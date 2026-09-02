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
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '4vh', textAlign: 'center', padding: '0 1rem' }}>
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
          <p style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem', color: '#ffffff', fontSize: '1.2rem', fontWeight: '500' }}>
            Inscrivez-vous pour tenter de gagner un bon de réduction !
          </p>
          <LoginForm />
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="https://www.jumia.ci/mlp-jumia-festival/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', transition: 'transform 0.2s ease' }} className="hover-scale">
              <img 
                src="/jumia-festival.jpg" 
                alt="Jumia Festival - Jusqu'à -60%" 
                style={{ width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }} 
              />
            </a>
          </div>

          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            padding: '2.5rem 1.5rem 1.5rem', 
            marginTop: '2rem', 
            marginBottom: '4rem',
            textAlign: 'left', 
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ borderTop: '2px solid #f3f4f6', position: 'relative', marginBottom: '2.5rem' }}>
              <span style={{ 
                background: '#9ca3af', 
                color: 'white', 
                padding: '0.5rem 1.5rem', 
                borderRadius: '50px', 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                fontWeight: '800', 
                fontSize: '1rem',
                whiteSpace: 'nowrap'
              }}>
                Termes & conditions
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                "Le jeu est ouvert tous les jours dans la limite des stocks de bons disponibles quotidiennement.",
                "On ne peut tourner la roue qu'une seule fois par jour (une seule participation par jour et par personne).",
                "En cas de victoire, le participant gagne un bon d'achat d'une valeur de 5 000 FCFA, valable pour un minimum de commande de 10 000 FCFA jusqu'au 30 Septembre inclus.",
                "Le code de réduction s'affiche immédiatement à l'écran en cas de gain. Il n'y a pas de tirage au sort ultérieur.",
                "Les bons d'achat gagnés ne sont pas transférables, ne peuvent être échangés contre de l'espèce, et sont applicables directement lors du passage de la commande sur Jumia.",
                "S'inscrire pour le jeu sur la page dédiée en renseignant son nom complet, son adresse email et son contact téléphonique avant de commencer à jouer. Le jeu se déroule uniquement sur l'Application JUMIA.",
                "En participant à ce jeu, vous donnez à Jumia le droit de vous contacter et l'autorisation d'utiliser vos informations à des fins marketing.",
                "La décision de Jumia concernant toutes les questions relatives à cette promotion sera finale et aucune correspondance ne sera échangée.",
                "Jumia se réserve le droit de modifier, suspendre ou annuler la promotion et les présents Termes et Conditions sans préavis en cas de force majeure."
              ].map((term, i) => (
                <li key={i} style={{ position: 'relative', paddingLeft: '1.5rem', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6', color: '#4b5563', fontWeight: '500' }}>
                  <span style={{ color: '#f97316', position: 'absolute', left: 0, top: '0', fontSize: '1.5rem', lineHeight: '1' }}>•</span>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
