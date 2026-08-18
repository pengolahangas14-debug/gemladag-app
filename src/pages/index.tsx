import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          Platform Bank Sampah Digital
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mt-4 text-emerald-950">
          Ubah Sampah Jadi Berkah Bersama <span className="text-emerald-600">GEMLADAG</span>
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
          Bank Sampah Perintis membantu Anda mengelola sampah rumah tangga, menukarnya menjadi saldo tabungan, dan mengumpulkan poin reward lingkungan.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition">
            Daftar Sebagai Nasabah
          </Link>
          <Link href="/login" className="bg-white border border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition">
            Setor Sampah Sekarang
          </Link>
        </div>
      </main>
    </div>
  );
}
