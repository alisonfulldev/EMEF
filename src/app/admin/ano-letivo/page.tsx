'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnoLetivo } from '@/types';

export default function AnoLetivoPage() {
  const [anos, setAnos] = useState<AnoLetivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ano: new Date().getFullYear(),
    data_inicio: '',
    data_fim: '',
  });

  useEffect(() => {
    fetchAnos();
  }, []);

  const fetchAnos = async () => {
    try {
      const res = await fetch('/api/admin/ano-letivo');
      setAnos(await res.json());
    } catch (error) {
      toast.error('Erro');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/ano-letivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success('Ano letivo criado');
      setFormData({ ano: new Date().getFullYear(), data_inicio: '', data_fim: '' });
      fetchAnos();
    } catch (error) {
      toast.error('Erro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await fetch(`/api/admin/ano-letivo/${id}`, { method: 'DELETE' });
      toast.success('Deletado');
      fetchAnos();
    } catch (error) {
      toast.error('Erro');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Anos Letivos</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ano *</label>
              <input
                type="number"
                required
                value={formData.ano}
                onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Início *</label>
              <input
                type="date"
                required
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Fim *</label>
              <input
                type="date"
                required
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                className="input-base"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Adicionar</button>
        </form>

        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="space-y-2">
            {anos.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50">
                <div>
                  <p className="font-medium">{a.ano}</p>
                  <p className="text-sm text-slate-600">{a.data_inicio} até {a.data_fim}</p>
                </div>
                <button onClick={() => handleDelete(a.id)} className="text-red-600 p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
