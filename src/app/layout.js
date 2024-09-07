import { AuthContextProvider } from '../app/context/AuthContext';
import './globals.css'
import Footer from './components/Footer';
import { Montserrat } from 'next/font/google';

// Configura la fuente
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

export const metadata = {
  title: 'Shop3d',
  description: 'IMPRESIONES 3D',
  favicon: '/brazo.png',
}

export default function RootLayout({ children  }) {

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places"></script> */}
      </head>
      <body className={`min-h-screen min-w-screen ${montserrat.className}`}>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
      </body>
    </html>
  );
}