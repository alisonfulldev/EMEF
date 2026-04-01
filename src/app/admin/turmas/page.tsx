'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Turma, AnoLetivo } from '@/types';

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    turno: 'matutino' as const,
    ano_letivo_id: '',
  });

  useEffect(() => {
    fetchTurmas();
    fetchAnosLetivos();
  }, []);

  const fetchTurmas = async () => {
    try {
      const res = await fetch('/api/admin/turmas');
      setTurmas(await res.json());
    } catch (error) {
      toast.error('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnosLetivos = async () => {
    try {
      const res = await fetch('/api/admin/ano-letivo');
      setAnosLetivos(await res.json());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/admin/turmas/${editingId}` : '/api/admin/turmas';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      toast.success(editingId ? 'Turma atualizada' : 'Turma criada');
      setShowModal(false);
      setFormData({ nome: '', turno: 'matutino', ano_letivo_id: '' });
      fetchTurmas();
    } catch (error) {
      toast.error('Erro ao salvar turma');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await fetch(`/api/admin/turmas/${id}`, { method: 'DELETE' });
      toast.success('Turma deletada');
      fetchTurmas();
    } catch (error) {
      toast.error('Erro ao deletar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Turmas</h1>
        <button onClick={() => { setEditingId(null); setFormData({ nome: '', turno: 'matutino', ano_letivo_id: '' }); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Turma
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-stripe table-hover">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Nome</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Turno</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Ano Letivo</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma) => (
                  <tr key={turma.id}>
                    <td className="px-4 py-3 font-medium">{turma.nome}</td>
                    <td className="px-4 py-3">{turma.turno}</td>
                    <td className="px-4 py-3">{turma.ano_letivo_id}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="inline px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(turma.id)} className="inline px-2 py-1 text-red-600 hover:bg-red-50 rounded">
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b font-bold">Nova Turma</div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="input-base"
                  placeholder="ex: 1ºA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Turno *</label>
                <select
                  required
                  value={formData.turno}
                  onChange={(e) => setFormData({ ...formData, turno: e.target.value as any })}
                  className="select-base"
                >
                  <option value="matutino">Matutino</option>
                  <option value="vespertino">Vespertino</option>
                  <option value="noturno">Noturno</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ano Letivo *</label>
                <select
                  required
                  value={formData.ano_letivo_id}
                  onChange={(e) => setFormData({ ...formData, ano_letivo_id: e.target.value })}
                  className="select-base"
                >
                  <option value="">Selecione</option>
                  {anosLetivos.map((a) => (
                    <option key={a.id} value={a.id}>{a.ano}</option>
                  ))}
                </select>
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
