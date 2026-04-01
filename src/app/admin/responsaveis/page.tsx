'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResponsaveisPage() {
  const [responsaveis, setResponsaveis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponsaveis();
  }, []);

  const fetchResponsaveis = async () => {
    try {
      const res = await fetch('/api/admin/responsaveis');
      setResponsaveis(await res.json());
    } catch (error) {
      toast.error('Erro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await fetch(`/api/admin/responsaveis/${id}`, { method: 'DELETE' });
      toast.success('Deletado');
      fetchResponsaveis();
    } catch (error) {
      toast.error('Erro');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Responsáveis</h1>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-stripe">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nome</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left font-semibold">Telefone</th>
                  <th className="px-4 py-2 text-center font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {responsaveis.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium">{r.usuario_nome || 'N/A'}</td>
                    <td className="px-4 py-3">{r.email || '-'}</td>
                    <td className="px-4 py-3">{r.telefone || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(r.id)} className="text-red-600 p-2 hover:bg-red-50 rounded inline">
                        <Trash2 size={16} />
                      </button>
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
