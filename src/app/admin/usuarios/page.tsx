'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Usuario, Perfil } from '@/types';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    perfil: 'professor' as Perfil,
    ativo: true,
  });

  const perfis: Perfil[] = ['professor', 'responsavel', 'admin', 'secretaria', 'diretor'];

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/admin/usuarios');
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao carregar');
        setUsuarios([]);
        return;
      }
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/admin/usuarios/${editingId}` : '/api/admin/usuarios';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      toast.success(editingId ? 'Atualizado' : 'Criado');
      setShowModal(false);
      setFormData({ email: '', nome: '', perfil: 'professor', ativo: true });
      fetchUsuarios();
    } catch (error) {
      toast.error('Erro');
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData({
      email: usuario.email,
      nome: usuario.nome,
      perfil: usuario.perfil,
      ativo: usuario.ativo,
    });
    setEditingId(usuario.id);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <button onClick={() => { setEditingId(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Novo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-stripe">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nome</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left font-semibold">Perfil</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-center font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium">{u.nome}</td>
                    <td className="px-4 py-3 text-sm">{u.email}</td>
                    <td className="px-4 py-3"><span className="badge-info">{u.perfil}</span></td>
                    <td className="px-4 py-3">{u.ativo ? <span className="badge-success">Ativo</span> : <span className="badge-danger">Inativo</span>}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleEdit(u)} className="text-blue-600 p-2 hover:bg-blue-50 rounded inline">
                        <Edit2 size={16} />
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
            <div className="p-6 border-b font-bold">
              {editingId ? 'Editar Usuário' : 'Novo Usuário'}
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-base"
              />
              <input
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="input-base"
              />
              <select
                value={formData.perfil}
                onChange={(e) => setFormData({ ...formData, perfil: e.target.value as Perfil })}
                className="select-base"
              >
                {perfis.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="ativo" className="text-sm font-medium cursor-pointer">
                  Ativo
                </label>
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
