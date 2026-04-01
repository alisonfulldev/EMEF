'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Aluno, StatusRegistro } from '@/types';

export default function ChamadaPage() {
  const params = useParams();
  const aulaId = params.aulaId as string;
  const [alunos, setAlunos] = useState<(Aluno & { status: StatusRegistro })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [chamadaId, setChamadaId] = useState<string | null>(null);

  useEffect(() => {
    fetchAlunos();
  }, [aulaId]);

  const fetchAlunos = async () => {
    try {
      const res = await fetch(`/api/professor/chamada?aulaId=${aulaId}`);
      const data = await res.json();
      setAlunos(data.map((a: any) => ({ ...a, status: 'presença' })));
    } catch (error) {
      toast.error('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (alunoId: string, status: StatusRegistro) => {
    setAlunos(alunos.map((a) => (a.id === alunoId ? { ...a, status } : a)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/professor/chamada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aula_id: aulaId,
          registros: alunos.map((a) => ({
            aluno_id: a.id,
            status: a.status,
          })),
        }),
      });
      const data = await res.json();
      setChamadaId(data.chamada_id);
      toast.success('Chamada registrada com sucesso');
    } catch (error) {
      toast.error('Erro ao registrar chamada');
    } finally {
      setSaving(false);
    }
  };

  const handleEnviar = async () => {
    if (!chamadaId) {
      toast.error('Chamada não foi salva');
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/chamada/${chamadaId}/enviar`, {
        method: 'POST',
      });
      const data = await res.json();
      toast.success(`${data.enviados} email(s) enviado(s) aos responsáveis`);
    } catch (error) {
      toast.error('Erro ao enviar emails');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  const statusButtons: { label: string; value: StatusRegistro; color: string }[] = [
    { label: 'Presença', value: 'presença', color: 'green' },
    { label: 'Falta', value: 'falta', color: 'red' },
    { label: 'Atraso', value: 'atraso', color: 'amber' },
    { label: 'Justificada', value: 'justificada', color: 'blue' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Registrar Chamada</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Nº</th>
                <th className="px-4 py-3 text-left font-semibold">Aluno</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">{aluno.numero_chamada}</td>
                  <td className="px-4 py-3 font-medium">{aluno.nome_completo}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {statusButtons.map((btn) => (
                        <button
                          key={btn.value}
                          type="button"
                          onClick={() => handleStatusChange(aluno.id, btn.value)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            aluno.status === btn.value
                              ? `bg-${btn.color}-600 text-white`
                              : `bg-${btn.color}-50 text-${btn.color}-600 hover:bg-${btn.color}-100`
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || chamadaId !== null}
            className="btn-primary flex-1"
          >
            {saving ? 'Salvando...' : 'Concluir Chamada'}
          </button>
          {chamadaId && (
            <button
              type="button"
              onClick={handleEnviar}
              disabled={sending}
              className="btn-success flex items-center gap-2"
            >
              {sending ? 'Enviando...' : '✉ Enviar para Responsáveis'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
