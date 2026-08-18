import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [selectedDep, setSelectedDep] = useState<any>(null);
  const [actualWeight, setActualWeight] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  async function fetchDeposits() {
    const { data } = await supabase
      .from('deposits')
      .select('*, profiles(full_name), waste_types(name, price_per_kg)')
      .order('created_at', { ascending: false });
    setDeposits(data || []);
  }

  async function handleVerify(status: 'selesai' | 'ditolak') {
    if (!selectedDep) return;
    setLoading(true);

    // Pemanggilan fungsi aman atomic backend process_deposit_admin
    const { error } = await supabase.rpc('process_deposit_admin', {
      p_deposit_id: selectedDep.id,
      p_actual_weight: actualWeight,
      p_status: status
    });

    setLoading(false);
    if (error) {
      alert('Gagal memproses setoran: ' + error.message);
    } else {
      alert('Setoran berhasil diperbarui!');
      setSelectedDep(null);
      fetchDeposits();
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Setoran Sampah (Admin)</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Nasabah</th>
              <th className="p-3">Jenis Sampah</th>
              <th className="p-3">Est. Berat</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deposits.map((dep) => (
              <tr key={dep.id}>
                <td className="p-3 font-medium">{dep.profiles?.full_name}</td>
                <td className="p-3">{dep.waste_types?.name}</td>
                <td className="p-3">{dep.estimated_weight} Kg</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    dep.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {dep.status}
                  </span>
                </td>
                <td className="p-3">
                  {dep.status === 'menunggu' && (
                    <button
                      onClick={() => { setSelectedDep(dep); setActualWeight(dep.estimated_weight); }}
                      className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-emerald-700"
                    >
                      Verifikasi
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Verifikasi Admin */}
      {selectedDep && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Verifikasi Setoran</h3>
            <p className="text-sm text-gray-600">Nasabah: <strong>{selectedDep.profiles?.full_name}</strong></p>
            <p className="text-sm text-gray-600">Jenis: <strong>{selectedDep.waste_types?.name}</strong></p>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Berat Aktual Timbangan (Kg)</label>
              <input
                type="number"
                step="0.1"
                value={actualWeight}
                onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setSelectedDep(null)} className="px-4 py-2 text-sm text-gray-600 border rounded-lg">Batal</button>
              <button onClick={() => handleVerify('ditolak')} disabled={loading} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg">Tolak</button>
              <button onClick={() => handleVerify('selesai')} disabled={loading} className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg">Konfirmasi & Bayar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
