'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Professor, Usuario } from '@/types';

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    usuario_id: '',
    especialidade: '',
    formacao: '',
  });

  useEffect(() => {
    fetchProfessores();
    fetchUsuarios();
  }, []);

  const fetchProfessores = async () => {
    try {
      const res = await fetch('/api/admin/professores');
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao carregar');
        setProfessores([]);
        return;
      }
      setProfessores(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar');
      setProfessores([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/admin/usuarios');
      const data = await res.json();
      if (!res.ok) {
        setUsuarios([]);
        return;
      }
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      setUsuarios([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId
        ? `/api/admin/professores/${editingId}`
        : '/api/admin/professores';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      toast.success(editingId ? 'Professor atualizado' : 'Professor criado');
      setShowModal(false);
      resetForm();
      fetchProfessores();
    } catch (error) {
      toast.error('Erro ao salvar professor');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      const res = await fetch(`/api/admin/professores/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');
      toast.success('Professor deletado');
      fetchProfessores();
    } catch (error) {
      toast.error('Erro ao deletar');
    }
  };

  const handleEdit = (professor: any) => {
    setFormData({
      usuario_id: professor.usuario_id || '',
      especialidade: professor.especialidade || '',
      formacao: professor.formacao || '',
    });
    setEditingId(professor.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ usuario_id: '', especialidade: '', formacao: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Professores</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo
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
                  <th className="px-4 py-2 text-left font-semibold">Nome</th>
                  <th className="px-4 py-2 text-left font-semibold">Especialidade</th>
                  <th className="px-4 py-2 text-left font-semibold">Formação</th>
                  <th className="px-4 py-2 text-center font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {professores.map((p) => {
                  const usuario = usuarios.find(u => u.id === p.usuario_id);
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-medium">{usuario?.nome || 'N/A'}</td>
                      <td className="px-4 py-3">{p.especialidade || '-'}</td>
                      <td className="px-4 py-3">{p.formacao || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEdit(p)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                        >
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
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingId ? 'Editar Professor' : 'Novo Professor'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Usuário *</label>
                <select
                  required
                  value={formData.usuario_id}
                  onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
                  className="select-base"
                >
                  <option value="">Selecione um usuário</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Especialidade</label>
                <input
                  value={formData.especialidade}
                  onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Formação</label>
                <input
                  value={formData.formacao}
                  onChange={(e) => setFormData({ ...formData, formacao: e.target.value })}
                  className="input-base"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Salvar</button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
