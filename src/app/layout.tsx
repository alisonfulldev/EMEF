import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Diário Escolar de Narandiba',
  description: 'Sistema de Gestão Escolar',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
