import { AuthContextProvider } from '../app/context/AuthContext';
import './globals.css'
import { Montserrat } from 'next/font/google';

// Configura la fuente
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

export const metadata = {
  title: 'Makers',
  description: 'IMPRESIONES 3D',
}

export default function RootLayout({ children  }) {

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`min-h-screen min-w-screen ${montserrat.className}`}>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
      </body>
    </html>
  );
}
