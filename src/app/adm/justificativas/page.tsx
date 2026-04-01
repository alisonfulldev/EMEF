'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Justificativa, StatusJustificativa } from '@/types';

export default function JustificativasPage() {
  const [justificativas, setJustificativas] = useState<Justificativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusJustificativa | 'todas'>('todas');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    fetchJustificativas();
  }, [filter]);

  const fetchJustificativas = async () => {
    try {
      const url = filter === 'todas'
        ? '/api/adm/justificativas'
        : `/api/adm/justificativas?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setJustificativas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/justificativas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'aprovada', observacao_aprovacao: observacao }),
      });
      toast.success('Justificativa aprovada');
      setObservacao('');
      setExpandedId(null);
      fetchJustificativas();
    } catch (error) {
      toast.error('Erro');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/justificativas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejeitada', observacao_aprovacao: observacao }),
      });
      toast.success('Justificativa rejeitada');
      setObservacao('');
      setExpandedId(null);
      fetchJustificativas();
    } catch (error) {
      toast.error('Erro');
    }
  };

  const getStatusColor = (status: StatusJustificativa) => {
    const colors = {
      pendente: 'bg-amber-50 border-amber-200',
      aprovada: 'bg-green-50 border-green-200',
      rejeitada: 'bg-red-50 border-red-200',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Justificativas de Falta</h1>

      <div className="flex gap-2 mb-6">
        {['todas', 'pendente', 'aprovada', 'rejeitada'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 hover:border-slate-300'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="space-y-3">
          {justificativas.length === 0 ? (
            <p className="text-slate-600 text-center py-8">Nenhuma justificativa</p>
          ) : (
            justificativas.map((j) => (
              <div
                key={j.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${getStatusColor(j.status)}`}
              >
                <div
                  onClick={() =>
                    setExpandedId(expandedId === j.id ? null : j.id)
                  }
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold">Aluno: {j.aluno_id}</p>
                    <p className="text-sm text-slate-600">Data: {j.data_falta}</p>
                    <p className="text-sm text-slate-600">Motivo: {j.motivo}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      j.status === 'pendente'
                        ? 'bg-amber-200 text-amber-800'
                        : j.status === 'aprovada'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {j.status}
                  </span>
                </div>

                {expandedId === j.id && j.status === 'pendente' && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <textarea
                      placeholder="Observação (opcional)"
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      className="textarea-base w-full"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(j.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle size={18} />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(j.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <XCircle size={18} />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
