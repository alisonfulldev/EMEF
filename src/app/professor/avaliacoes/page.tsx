'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'prova',
    data_aplicacao: '',
    valor_maximo: 10,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/professor/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success('Avaliação criada');
      setShowModal(false);
      setFormData({ titulo: '', tipo: 'prova', data_aplicacao: '', valor_maximo: 10 });
      fetchAvaliacoes();
    } catch (error) {
      toast.error('Erro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await fetch(`/api/professor/avaliacoes/${id}`, { method: 'DELETE' });
      toast.success('Deletada');
      fetchAvaliacoes();
    } catch (error) {
      toast.error('Erro');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Avaliações</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {avaliacoes.length === 0 ? (
            <p className="text-slate-600">Nenhuma avaliação criada</p>
          ) : (
            avaliacoes.map((a) => (
              <div key={a.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <h3 className="font-bold mb-2">{a.titulo}</h3>
                <p className="text-sm text-slate-600 mb-4">Tipo: {a.tipo}</p>
                <p className="text-sm text-slate-600 mb-4">Data: {a.data_aplicacao}</p>
                <div className="flex gap-2">
                  <a href={`/professor/avaliacoes/${a.id}/notas`} className="btn-primary text-sm flex-1">
                    Lançar Notas
                  </a>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="btn-danger text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b font-bold">Nova Avaliação</div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                required
                placeholder="Título"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="input-base"
              />
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="select-base"
              >
                <option value="prova">Prova</option>
                <option value="trabalho">Trabalho</option>
                <option value="participacao">Participação</option>
              </select>
              <input
                type="date"
                required
                value={formData.data_aplicacao}
                onChange={(e) => setFormData({ ...formData, data_aplicacao: e.target.value })}
                className="input-base"
              />
              <input
                type="number"
                min="1"
                max="100"
                value={formData.valor_maximo}
                onChange={(e) => setFormData({ ...formData, valor_maximo: parseInt(e.target.value) })}
                className="input-base"
              />
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Criar</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
