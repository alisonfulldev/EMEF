'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Justificativa } from '@/types';

export default function JustificativasPage() {
  const [justificativas, setJustificativas] = useState<Justificativa[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    aluno_id: '',
    data_falta: '',
    motivo: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [justRes, alunosRes] = await Promise.all([
        fetch('/api/responsavel/justificativas'),
        fetch('/api/responsavel/alunos'),
      ]);
      setJustificativas(await justRes.json());
      setAlunos(await alunosRes.json());
    } catch (error) {
      toast.error('Erro');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/responsavel/justificativas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success('Justificativa enviada');
      setShowModal(false);
      setFormData({ aluno_id: '', data_falta: '', motivo: '' });
      fetchData();
    } catch (error) {
      toast.error('Erro ao enviar');
    }
  };

  const getStatusColor = (status: string) => {
    return {
      pendente: 'bg-amber-50 border-amber-200',
      aprovada: 'bg-green-50 border-green-200',
      rejeitada: 'bg-red-50 border-red-200',
    }[status] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Justificativas</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Enviar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="space-y-3">
          {justificativas.length === 0 ? (
            <p className="text-slate-600">Nenhuma justificativa enviada</p>
          ) : (
            justificativas.map((j) => (
              <div key={j.id} className={`border rounded-lg p-4 ${getStatusColor(j.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Data da falta: {j.data_falta}</p>
                    <p className="text-sm text-slate-600 mt-2">Motivo: {j.motivo}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    j.status === 'pendente' ? 'bg-amber-200 text-amber-800' :
                    j.status === 'aprovada' ? 'bg-green-200 text-green-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {j.status}
                  </span>
                </div>
                {j.observacao_aprovacao && (
                  <p className="text-sm text-slate-600 mt-3">Observação: {j.observacao_aprovacao}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b font-bold">Enviar Justificativa</div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <select
                required
                value={formData.aluno_id}
                onChange={(e) => setFormData({ ...formData, aluno_id: e.target.value })}
                className="select-base"
              >
                <option value="">Selecione um filho</option>
                {alunos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome_completo}
                  </option>
                ))}
              </select>

              <input
                type="date"
                required
                value={formData.data_falta}
                onChange={(e) => setFormData({ ...formData, data_falta: e.target.value })}
                className="input-base"
              />

              <textarea
                required
                placeholder="Motivo da falta"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                className="textarea-base"
                rows={4}
              />

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Enviar</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
