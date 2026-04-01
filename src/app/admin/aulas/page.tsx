'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Aula, Turma, Disciplina, Usuario } from '@/types';

export default function AulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    turma_id: '',
    disciplina_id: '',
    professor_id: '',
    data: '',
    horario_inicio: '',
    horario_fim: '',
    sala: '',
    conteudo_planejado: '',
    atividade_planejada: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aulaRes, turmaRes, discRes, userRes] = await Promise.all([
        fetch('/api/admin/aulas'),
        fetch('/api/admin/turmas'),
        fetch('/api/admin/disciplinas'),
        fetch('/api/admin/usuarios'),
      ]);

      const aulaData = await aulaRes.json();
      if (!aulaRes.ok) {
        toast.error(aulaData.error || 'Erro ao carregar aulas');
        setAulas([]);
      } else {
        setAulas(Array.isArray(aulaData) ? aulaData : []);
      }

      const turmaData = await turmaRes.json();
      if (!turmaRes.ok) {
        toast.error(turmaData.error || 'Erro ao carregar turmas');
        setTurmas([]);
      } else {
        setTurmas(Array.isArray(turmaData) ? turmaData : []);
      }

      const discData = await discRes.json();
      if (!discRes.ok) {
        toast.error(discData.error || 'Erro ao carregar disciplinas');
        setDisciplinas([]);
      } else {
        setDisciplinas(Array.isArray(discData) ? discData : []);
      }

      const userData = await userRes.json();
      if (!userRes.ok) {
        setUsuarios([]);
      } else {
        setUsuarios(Array.isArray(userData) ? userData : []);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
      setAulas([]);
      setTurmas([]);
      setDisciplinas([]);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/aulas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success('Aula criada');
      setShowModal(false);
      setFormData({ turma_id: '', disciplina_id: '', professor_id: '', data: '', horario_inicio: '', horario_fim: '', sala: '', conteudo_planejado: '', atividade_planejada: '' });
      fetchData();
    } catch (error) {
      toast.error('Erro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await fetch(`/api/admin/aulas/${id}`, { method: 'DELETE' });
      toast.success('Deletado');
      fetchData();
    } catch (error) {
      toast.error('Erro');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Aulas</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-stripe text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Data</th>
                  <th className="px-4 py-2 text-left font-semibold">Turma</th>
                  <th className="px-4 py-2 text-left font-semibold">Disciplina</th>
                  <th className="px-4 py-2 text-left font-semibold">Horário</th>
                  <th className="px-4 py-2 text-center font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {aulas.map((a) => {
                  const turma = turmas.find(t => t.id === a.turma_id);
                  const disciplina = disciplinas.find(d => d.id === a.disciplina_id);
                  return (
                    <tr key={a.id}>
                      <td className="px-4 py-3">{a.data}</td>
                      <td className="px-4 py-3">{turma?.nome || 'N/A'}</td>
                      <td className="px-4 py-3">{disciplina?.nome || 'N/A'}</td>
                      <td className="px-4 py-3">{a.horario_inicio}-{a.horario_fim}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleDelete(a.id)} className="text-red-600 p-2 inline hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b font-bold">Nova Aula</div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Turma *</label>
                <select required value={formData.turma_id} onChange={(e) => setFormData({ ...formData, turma_id: e.target.value })} className="select-base">
                  <option value="">Selecione uma turma</option>
                  {turmas.map((t) => (<option key={t.id} value={t.id}>{t.nome}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Disciplina *</label>
                <select required value={formData.disciplina_id} onChange={(e) => setFormData({ ...formData, disciplina_id: e.target.value })} className="select-base">
                  <option value="">Selecione uma disciplina</option>
                  {disciplinas.map((d) => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Professor *</label>
                <select required value={formData.professor_id} onChange={(e) => setFormData({ ...formData, professor_id: e.target.value })} className="select-base">
                  <option value="">Selecione um professor</option>
                  {usuarios.map((u) => (<option key={u.id} value={u.id}>{u.nome}</option>))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data *</label>
                  <input type="date" required value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sala</label>
                  <input placeholder="Ex: Sala 101" value={formData.sala} onChange={(e) => setFormData({ ...formData, sala: e.target.value })} className="input-base" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Horário Início *</label>
                  <input type="time" required value={formData.horario_inicio} onChange={(e) => setFormData({ ...formData, horario_inicio: e.target.value })} className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Horário Fim *</label>
                  <input type="time" required value={formData.horario_fim} onChange={(e) => setFormData({ ...formData, horario_fim: e.target.value })} className="input-base" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Conteúdo Planejado</label>
                <textarea value={formData.conteudo_planejado} onChange={(e) => setFormData({ ...formData, conteudo_planejado: e.target.value })} className="input-base" rows={3} placeholder="Descreva o conteúdo que será abordado" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Atividade Planejada</label>
                <textarea value={formData.atividade_planejada} onChange={(e) => setFormData({ ...formData, atividade_planejada: e.target.value })} className="input-base" rows={3} placeholder="Descreva a atividade que será realizada" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Salvar</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
