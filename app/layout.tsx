import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Wildlife Research DB Admin',
  description: 'Internal database management interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex text-gray-900">
        
        <main className="flex-1 bg-white overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}