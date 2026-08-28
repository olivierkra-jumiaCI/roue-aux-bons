import './globals.css';

export const metadata = {
  title: 'La Roue aux Bons',
  description: 'Tournez la roue et gagnez des bons de réduction !',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
