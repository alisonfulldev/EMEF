'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckCircle, X } from 'lucide-react';

export default function ResumoChamadaPage() {
  const params = useParams();
  const chamadaId = params.chamadaId as string;
  const [registros, setRegistros] = useState<any[]>([]);
  const [chamada, setChamada] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChamada();
  }, [chamadaId]);

  const fetchChamada = async () => {
    try {
      const res = await fetch(`/api/professor/chamada?chamada_id=${chamadaId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao carregar');
        return;
      }
      if (Array.isArray(data)) {
        setRegistros(data);
        if (data.length > 0) {
          setChamada({ id: chamadaId, data: data[0].data });
        }
      }
    } catch (error) {
      toast.error('Erro ao carregar resumo');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      presenca: { color: 'bg-green-100 text-green-800', label: 'Presença' },
      falta: { color: 'bg-red-100 text-red-800', label: 'Falta' },
      atraso: { color: 'bg-yellow-100 text-yellow-800', label: 'Atraso' },
      justificada: { color: 'bg-blue-100 text-blue-800', label: 'Justificada' },
    };
    const mapped = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <span className={`px-2 py-1 rounded text-sm font-medium ${mapped.color}`}>{mapped.label}</span>;
  };

  const stats = {
    total: registros.length,
    presentes: registros.filter(r => r.status === 'presenca' || r.status === 'atraso').length,
    faltas: registros.filter(r => r.status === 'falta').length,
    justificadas: registros.filter(r => r.status === 'justificada').length,
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resumo da Chamada</h1>
        <p className="text-slate-600">Data: {chamada?.data}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-green-600">Presentes</p>
          <p className="text-2xl font-bold text-green-600">{stats.presentes}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-red-600">Faltas</p>
          <p className="text-2xl font-bold text-red-600">{stats.faltas}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-blue-600">Justificadas</p>
          <p className="text-2xl font-bold text-blue-600">{stats.justificadas}</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-stripe">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Nº</th>
                <th className="px-4 py-2 text-left font-semibold">Nome</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Observação</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium">{r.numero_chamada}</td>
                  <td className="px-4 py-3">{r.aluno_nome || 'N/A'}</td>
                  <td className="px-4 py-3">{getStatusBadge(r.status)}</td>
                  <td className="px-4 py-3 text-slate-600">{r.observacao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
