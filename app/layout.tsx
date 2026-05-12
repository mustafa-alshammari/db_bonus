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
        
        {/* Persistent Sidebar Navigation */}
        <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
          <div className="p-6">
            <h2 className="text-xl font-bold tracking-tight">DB Admin</h2>
            <p className="text-sm text-slate-400 mt-1">Wildlife Research Center</p>
          </div>
          
          <nav className="mt-6 px-4 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Core</div>
            <Link href="/" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Dashboard</Link>
            <Link href="/projects" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Projects</Link>
            
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Personnel</div>
            <Link href="/employee" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Employees</Link>
            <Link href="/team" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Teams</Link>
            
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Field Data</div>
            <Link href="/camps" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Camps</Link>
            <Link href="/animal" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Animals</Link>
            
            {/* Add more links here as you build out the other 17 folders today */}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}