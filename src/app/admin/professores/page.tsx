'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Professor } from '@/types';

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    usuario_id: '',
    especialidade: '',
    formacao: '',
  });

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    try {
      const res = await fetch('/api/admin/professores');
      setProfessores(await res.json());
    } catch (error) {
      toast.error('Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/professores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success('Professor adicionado');
      setShowModal(false);
      setFormData({ usuario_id: '', especialidade: '', formacao: '' });
      fetchProfessores();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await fetch(`/api/admin/professores/${id}`, { method: 'DELETE' });
      toast.success('Deletado');
      fetchProfessores();
    } catch (error) {
      toast.error('Erro');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Professores</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
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
                {professores.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium">{p.usuario_nome || 'N/A'}</td>
                    <td className="px-4 py-3">{p.especialidade || '-'}</td>
                    <td className="px-4 py-3">{p.formacao || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:bg-red-50 p-2 rounded inline">
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
            <div className="p-6 border-b font-bold">Novo Professor</div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                placeholder="Especialidade"
                value={formData.especialidade}
                onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                className="input-base"
              />
              <input
                placeholder="Formação"
                value={formData.formacao}
                onChange={(e) => setFormData({ ...formData, formacao: e.target.value })}
                className="input-base"
              />
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
