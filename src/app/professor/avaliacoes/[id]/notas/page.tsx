'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface Nota {
  aluno_id: string;
  aluno_nome: string;
  numero_chamada: number;
  nota: number | null;
  observacao: string;
}

export default function NotasAvaliacaoPage() {
  const params = useParams();
  const avaliacaoId = params.id as string;
  const [notas, setNotas] = useState<Nota[]>([]);
  const [avaliacao, setAvaliacao] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotas();
  }, [avaliacaoId]);

  const fetchNotas = async () => {
    try {
      const res = await fetch(`/api/avaliacoes/${avaliacaoId}/notas`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao carregar');
        return;
      }
      if (Array.isArray(data.notas)) {
        setNotas(data.notas);
        setAvaliacao(data.avaliacao);
      }
    } catch (error) {
      toast.error('Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  };

  const handleNotaChange = (alunoId: string, value: string) => {
    setNotas(notas.map(n =>
      n.aluno_id === alunoId
        ? { ...n, nota: value === '' ? null : Math.min(parseFloat(value), avaliacao?.valor_maximo || 10) }
        : n
    ));
  };

  const handleObservacaoChange = (alunoId: string, value: string) => {
    setNotas(notas.map(n =>
      n.aluno_id === alunoId
        ? { ...n, observacao: value }
        : n
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/avaliacoes/${avaliacaoId}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas }),
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      toast.success('Notas salvas com sucesso');
      fetchNotas();
    } catch (error) {
      toast.error('Erro ao salvar notas');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lançar Notas</h1>
        <p className="text-slate-600">{avaliacao?.titulo}</p>
        <p className="text-sm text-slate-500">Valor máximo: {avaliacao?.valor_maximo}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-stripe">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Nº</th>
                <th className="px-4 py-2 text-left font-semibold">Nome</th>
                <th className="px-4 py-2 text-center font-semibold">Nota</th>
                <th className="px-4 py-2 text-left font-semibold">Observação</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((n) => (
                <tr key={n.aluno_id}>
                  <td className="px-4 py-3 font-medium">{n.numero_chamada}</td>
                  <td className="px-4 py-3">{n.aluno_nome}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max={avaliacao?.valor_maximo || 10}
                      step="0.5"
                      value={n.nota ?? ''}
                      onChange={(e) => handleNotaChange(n.aluno_id, e.target.value)}
                      placeholder="-"
                      className="w-20 text-center input-base"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={n.observacao}
                      onChange={(e) => handleObservacaoChange(n.aluno_id, e.target.value)}
                      placeholder="Opcional"
                      className="w-full input-base text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-6"
        >
          {saving ? 'Salvando...' : 'Salvar Notas'}
        </button>
      </div>
    </div>
  );
}
