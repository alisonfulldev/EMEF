'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Usuario } from '@/types';

export default function ResponsaveisPage() {
  const [responsaveis, setResponsaveis] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    usuario_id: '',
    crm: '',
    profissao: '',
    telefone: '',
  });

  useEffect(() => {
    fetchResponsaveis();
    fetchUsuarios();
  }, []);

  const fetchResponsaveis = async () => {
    try {
      const res = await fetch('/api/admin/responsaveis');
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao carregar');
        setResponsaveis([]);
        return;
      }
      setResponsaveis(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar responsáveis');
      setResponsaveis([]);
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
        ? `/api/admin/responsaveis/${editingId}`
        : '/api/admin/responsaveis';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      toast.success(editingId ? 'Responsável atualizado' : 'Responsável criado');
      setShowModal(false);
      resetForm();
      fetchResponsaveis();
    } catch (error) {
      toast.error('Erro ao salvar responsável');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      const res = await fetch(`/api/admin/responsaveis/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');
      toast.success('Responsável deletado');
      fetchResponsaveis();
    } catch (error) {
      toast.error('Erro ao deletar');
    }
  };

  const handleEdit = (responsavel: any) => {
    setFormData({
      usuario_id: responsavel.usuario_id || '',
      crm: responsavel.crm || '',
      profissao: responsavel.profissao || '',
      telefone: responsavel.telefone || '',
    });
    setEditingId(responsavel.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      usuario_id: '',
      crm: '',
      profissao: '',
      telefone: '',
    });
    setEditingId(null);
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Responsáveis</h1>
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
        <div className="overflow-x-auto">
          <table className="w-full table-stripe table-hover">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Nome</th>
                <th className="px-4 py-2 text-left font-semibold">Profissão</th>
                <th className="px-4 py-2 text-left font-semibold">Telefone</th>
                <th className="px-4 py-2 text-left font-semibold">CRM</th>
                <th className="px-4 py-2 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {responsaveis.map((r) => {
                const usuario = usuarios.find(u => u.id === r.usuario_id);
                return (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium">{usuario?.nome || 'N/A'}</td>
                    <td className="px-4 py-3">{r.profissao || '-'}</td>
                    <td className="px-4 py-3">{r.telefone || '-'}</td>
                    <td className="px-4 py-3">{r.crm || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(r)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
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
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingId ? 'Editar Responsável' : 'Novo Responsável'}
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
                <label className="block text-sm font-medium mb-1">Profissão</label>
                <input
                  value={formData.profissao}
                  onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CRM</label>
                <input
                  value={formData.crm}
                  onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
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
