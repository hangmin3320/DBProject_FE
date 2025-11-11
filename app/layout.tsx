import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Micro SNS',
  description: 'A micro social networking service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}