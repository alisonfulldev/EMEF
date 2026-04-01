'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Disciplina } from '@/types';

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    try {
      const res = await fetch('/api/admin/disciplinas');
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao carregar');
        setDisciplinas([]);
        return;
      }
      setDisciplinas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar');
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/disciplinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });
      toast.success('Disciplina adicionada');
      setNome('');
      fetchDisciplinas();
    } catch (error) {
      toast.error('Erro ao adicionar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await fetch(`/api/admin/disciplinas/${id}`, { method: 'DELETE' });
      toast.success('Deletada');
      fetchDisciplinas();
    } catch (error) {
      toast.error('Erro');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Disciplinas</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            placeholder="Nome da disciplina"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input-base flex-1"
          />
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Adicionar
          </button>
        </form>

        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="space-y-2">
            {disciplinas.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50">
                <span className="font-medium">{d.nome}</span>
                <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
