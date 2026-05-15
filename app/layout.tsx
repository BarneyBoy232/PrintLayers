import type { Metadata } from 'next';
import './globals.css';
import ClientWrapper from './ClientWrapper'; // <-- Fixed to ./

export const metadata: Metadata = {
  title: 'PrintLayers',
  description: 'Decentralized 3D Printing Marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ClientWrapper>
        {children}
      </ClientWrapper>
    </html>
  );
}