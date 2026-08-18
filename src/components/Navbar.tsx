import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ userRole }: { userRole?: 'nasabah' | 'admin' | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-emerald-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
            🌱 <span>GEMLADAG</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="hover:text-emerald-200">Berita/Home</Link>
            <Link href="/about" className="hover:text-emerald-200">Tentang Kami</Link>
            <Link href="/services" className="hover:text-emerald-200">Layanan</Link>
            <Link href="/waste-prices" className="hover:text-emerald-200">Harga Sampah</Link>

            {userRole === 'nasabah' && (
              <Link href="/nasabah" className="bg-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-500 hover:bg-emerald-500">Dashboard Nasabah</Link>
            )}
            {userRole === 'admin' && (
              <Link href="/admin" className="bg-amber-600 px-3 py-1.5 rounded-lg border border-amber-500 hover:bg-amber-500">Dashboard Admin</Link>
            )}
            {!userRole && (
              <div className="flex gap-2">
                <Link href="/login" className="px-3 py-1.5 rounded-lg hover:bg-emerald-600">Masuk</Link>
                <Link href="/register" className="bg-white text-emerald-800 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-50">Daftar</Link>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-emerald-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-emerald-800 px-4 pt-2 pb-4 space-y-2 border-t border-emerald-600">
          <Link href="/" className="block py-2 hover:bg-emerald-700 px-2 rounded">Home</Link>
          <Link href="/about" className="block py-2 hover:bg-emerald-700 px-2 rounded">Tentang Kami</Link>
          <Link href="/services" className="block py-2 hover:bg-emerald-700 px-2 rounded">Layanan</Link>
          <Link href="/waste-prices" className="block py-2 hover:bg-emerald-700 px-2 rounded">Harga Sampah</Link>
          {!userRole ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="text-center py-2 bg-emerald-600 rounded">Masuk</Link>
              <Link href="/register" className="text-center py-2 bg-white text-emerald-800 font-bold rounded">Daftar Nasabah</Link>
            </div>
          ) : (
            <Link href={userRole === 'admin' ? '/admin' : '/nasabah'} className="block text-center py-2 bg-emerald-500 font-bold rounded">Ke Dashboard</Link>
          )}
        </div>
      )}
    </nav>
  );
}
