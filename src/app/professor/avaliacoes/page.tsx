'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Turma, Disciplina, Aula } from '@/types';

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'prova' as const,
    turma_id: '',
    disciplina_id: '',
    aula_id: '',
    data_aplicacao: '',
    data_entrega: '',
    valor_maximo: 10,
    descricao: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [avRes, turRes, dicRes, aulRes] = await Promise.all([
        fetch('/api/professor/avaliacoes'),
        fetch('/api/admin/turmas'),
        fetch('/api/admin/disciplinas'),
        fetch('/api/admin/aulas'),
      ]);

      const avData = await avRes.json();
      if (avRes.ok) setAvaliacoes(Array.isArray(avData) ? avData : []);
      else setAvaliacoes([]);

      const turData = await turRes.json();
      if (turRes.ok) setTurmas(Array.isArray(turData) ? turData : []);

      const dicData = await dicRes.json();
      if (dicRes.ok) setDisciplinas(Array.isArray(dicData) ? dicData : []);

      const aulData = await aulRes.json();
      if (aulRes.ok) setAulas(Array.isArray(aulData) ? aulData : []);
    } catch (error) {
      toast.error('Erro ao carregar dados');
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
      setFormData({ titulo: '', tipo: 'prova', turma_id: '', disciplina_id: '', aula_id: '', data_aplicacao: '', data_entrega: '', valor_maximo: 10, descricao: '' });
      fetchData();
    } catch (error) {
      toast.error('Erro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      const res = await fetch(`/api/professor/avaliacoes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');
      toast.success('Avaliação deletada');
      fetchData();
    } catch (error) {
      toast.error('Erro ao deletar');
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
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  required
                  placeholder="Ex: Prova Bimestral"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Turma *</label>
                <select
                  required
                  value={formData.turma_id}
                  onChange={(e) => setFormData({ ...formData, turma_id: e.target.value })}
                  className="select-base"
                >
                  <option value="">Selecione uma turma</option>
                  {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Disciplina *</label>
                <select
                  required
                  value={formData.disciplina_id}
                  onChange={(e) => setFormData({ ...formData, disciplina_id: e.target.value })}
                  className="select-base"
                >
                  <option value="">Selecione uma disciplina</option>
                  {disciplinas.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Aula</label>
                <select
                  value={formData.aula_id}
                  onChange={(e) => setFormData({ ...formData, aula_id: e.target.value })}
                  className="select-base"
                >
                  <option value="">Selecione uma aula (opcional)</option>
                  {aulas.map((a) => <option key={a.id} value={a.id}>{a.data} - {a.horario_inicio}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                  className="select-base"
                >
                  <option value="prova">Prova</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="participacao">Participação</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data Aplicação *</label>
                  <input
                    type="date"
                    required
                    value={formData.data_aplicacao}
                    onChange={(e) => setFormData({ ...formData, data_aplicacao: e.target.value })}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data Entrega</label>
                  <input
                    type="date"
                    value={formData.data_entrega}
                    onChange={(e) => setFormData({ ...formData, data_entrega: e.target.value })}
                    className="input-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor Máximo</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.valor_maximo}
                  onChange={(e) => setFormData({ ...formData, valor_maximo: parseInt(e.target.value) })}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="input-base"
                  rows={3}
                  placeholder="Descrição da avaliação"
                />
              </div>
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
