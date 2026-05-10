import type { Metadata } from 'next';
// @ts-expect-error - CSS side-effect imports sometimes lack type declarations in specific TS configs
import './globals.css';
import ClientWrapper from './ClientWrapper';

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