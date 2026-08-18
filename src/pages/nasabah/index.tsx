import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NasabahDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load Profile
      const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      setProfile(prof);

      // Load Transaksi Terbaru / Deposit
      const { data: deps } = await supabase
        .from('deposits')
        .select('*, waste_types(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setDeposits(deps || []);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data nasabah...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Profile */}
      <div className="bg-emerald-800 text-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Halo, {profile?.full_name || 'Nasabah'}! 👋</h1>
        <p className="text-emerald-100 text-sm mt-1">Selamat datang kembali di Bank Sampah Gemladag.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-emerald-700/60 p-4 rounded-xl backdrop-blur-sm border border-emerald-600">
            <span className="text-xs text-emerald-200">Saldo Utama</span>
            <p className="text-xl font-extrabold mt-1">Rp {Number(profile?.balance || 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-emerald-700/60 p-4 rounded-xl backdrop-blur-sm border border-emerald-600">
            <span className="text-xs text-emerald-200">Poin Reward</span>
            <p className="text-xl font-extrabold mt-1">{profile?.points || 0} PTS</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/nasabah/setor" className="flex flex-col items-center justify-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition">
          <span className="text-2xl">♻️</span>
          <span className="text-sm font-semibold text-emerald-900 mt-2">Setor Sampah</span>
        </Link>
        <Link href="/nasabah/pickup" className="flex flex-col items-center justify-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition">
          <span className="text-2xl">🚚</span>
          <span className="text-sm font-semibold text-emerald-900 mt-2">Jadwal Pickup</span>
        </Link>
        <Link href="/nasabah/reward" className="flex flex-col items-center justify-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition">
          <span className="text-2xl">🎁</span>
          <span className="text-sm font-semibold text-emerald-900 mt-2">Tukar Poin</span>
        </Link>
        <Link href="/nasabah/riwayat" className="flex flex-col items-center justify-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition">
          <span className="text-2xl">📜</span>
          <span className="text-sm font-semibold text-emerald-900 mt-2">Riwayat</span>
        </Link>
      </div>

      {/* Tabel Setoran Terbaru */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Setoran Terakhir</h2>
        {deposits.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">Belum ada riwayat setoran sampah.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Jenis Sampah</th>
                  <th className="p-3">Est. Berat</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deposits.map((dep) => (
                  <tr key={dep.id}>
                    <td className="p-3">{new Date(dep.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="p-3 font-medium">{dep.waste_types?.name || '-'}</td>
                    <td className="p-3">{dep.estimated_weight} Kg</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        dep.status === 'selesai' ? 'bg-green-100 text-green-700' :
                        dep.status === 'ditolak' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {dep.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
