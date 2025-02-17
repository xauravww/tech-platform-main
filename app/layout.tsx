import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from './components/Navbar';
 
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tech Services Platform',
  description: 'Discover our comprehensive range of technical services and solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div style={{maxHeight:"calc(100vh - 65px )" , minHeight:"calc(100vh - 65px )"}} className='overflow-y-scroll'>
        {children}
        </div>
      </body>
    </html>
  );
}
