'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function NotasPage() {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvaliacaoId, setSelectedAvaliacaoId] = useState<string | null>(null);
  const [notas, setNotas] = useState<any[]>([]);

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  const fetchAvaliacoes = async () => {
    try {
      const res = await fetch('/api/professor/avaliacoes');
      setAvaliacoes(await res.json());
    } catch (error) {
      toast.error('Erro');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAvaliacao = async (avaliacaoId: string) => {
    try {
      const res = await fetch(`/api/avaliacoes/${avaliacaoId}/notas`);
      const data = await res.json();
      setNotas(data);
      setSelectedAvaliacaoId(avaliacaoId);
    } catch (error) {
      toast.error('Erro ao carregar notas');
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold mb-4">Avaliações</h2>
          <div className="space-y-2">
            {avaliacoes.length === 0 ? (
              <p className="text-slate-600 text-sm">Nenhuma avaliação</p>
            ) : (
              avaliacoes.map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleSelectAvaliacao(a.id)}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selectedAvaliacaoId === a.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <p className="font-medium text-sm">{a.titulo}</p>
                  <p className="text-xs text-slate-600">{a.tipo}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedAvaliacaoId && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="font-bold mb-4">Registrar Notas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Aluno</th>
                    <th className="px-4 py-2 text-left">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((nota) => (
                    <tr key={nota.aluno_id} className="border-t">
                      <td className="px-4 py-3">{nota.aluno_nome}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          defaultValue={nota.nota || ''}
                          className="input-base w-24"
                          placeholder="Nota"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
