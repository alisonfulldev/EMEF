'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Aluno, Turma } from '@/types';

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<(Aluno & { turma_nome?: string })[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome_completo: '',
    data_nascimento: '',
    numero_chamada: '',
    matricula: '',
    turma_id: '',
    foto_url: '',
  });

  useEffect(() => {
    fetchAlunos();
    fetchTurmas();
  }, [search]);

  const fetchAlunos = async () => {
    try {
      const res = await fetch(`/api/admin/alunos?search=${search}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao carregar alunos');
        setAlunos([]);
        return;
      }
      setAlunos(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar alunos');
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTurmas = async () => {
    try {
      const res = await fetch('/api/admin/turmas');
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao carregar turmas');
        setTurmas([]);
        return;
      }
      setTurmas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching turmas:', error);
      setTurmas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId
        ? `/api/admin/alunos/${editingId}`
        : '/api/admin/alunos';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      toast.success(editingId ? 'Aluno atualizado' : 'Aluno criado');
      setShowModal(false);
      setFormData({
        nome_completo: '',
        data_nascimento: '',
        numero_chamada: '',
        matricula: '',
        turma_id: '',
        foto_url: '',
      });
      fetchAlunos();
    } catch (error) {
      toast.error('Erro ao salvar aluno');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await fetch(`/api/admin/alunos/${id}`, { method: 'DELETE' });
      toast.success('Aluno deletado');
      fetchAlunos();
    } catch (error) {
      toast.error('Erro ao deletar');
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setFormData({
      nome_completo: aluno.nome_completo,
      data_nascimento: aluno.data_nascimento || '',
      numero_chamada: aluno.numero_chamada.toString(),
      matricula: aluno.matricula,
      turma_id: aluno.turma_id,
      foto_url: aluno.foto_url || '',
    });
    setEditingId(aluno.id);
    setShowModal(true);
  };

  const filteredAlunos = alunos.filter(a =>
    a.nome_completo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Alunos</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              nome_completo: '',
              data_nascimento: '',
              numero_chamada: '',
              matricula: '',
              turma_id: '',
              foto_url: '',
            });
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Aluno
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base flex-1"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-stripe table-hover">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Matrícula</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Nome</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Turma</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Nº Chamada</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td className="px-4 py-3 text-sm">{aluno.matricula}</td>
                    <td className="px-4 py-3 text-sm font-medium">{aluno.nome_completo}</td>
                    <td className="px-4 py-3 text-sm">{aluno.turma_nome || '-'}</td>
                    <td className="px-4 py-3 text-sm">{aluno.numero_chamada}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(aluno)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(aluno.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
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
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingId ? 'Editar Aluno' : 'Novo Aluno'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nome_completo}
                  onChange={(e) =>
                    setFormData({ ...formData, nome_completo: e.target.value })
                  }
                  className="input-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) =>
                      setFormData({ ...formData, data_nascimento: e.target.value })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nº Chamada *</label>
                  <input
                    type="number"
                    required
                    value={formData.numero_chamada}
                    onChange={(e) =>
                      setFormData({ ...formData, numero_chamada: e.target.value })
                    }
                    className="input-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Matrícula *</label>
                <input
                  type="text"
                  required
                  value={formData.matricula}
                  onChange={(e) =>
                    setFormData({ ...formData, matricula: e.target.value })
                  }
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Turma *</label>
                <select
                  required
                  value={formData.turma_id}
                  onChange={(e) =>
                    setFormData({ ...formData, turma_id: e.target.value })
                  }
                  className="select-base"
                >
                  <option value="">Selecione uma turma</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Salvar
                </button>
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
