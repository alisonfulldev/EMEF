'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Escola, Usuario } from '@/types';

export default function EscolaPage() {
  const [escola, setEscola] = useState<Escola | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    endereco: '',
    cidade: '',
    estado: '',
    telefone: '',
    email: '',
    diretor_id: '',
  });

  useEffect(() => {
    fetchEscola();
    fetchUsuarios();
  }, []);

  const fetchEscola = async () => {
    try {
      const res = await fetch('/api/admin/escola');
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro');
        return;
      }
      if (data?.nome) {
        setEscola(data);
        setFormData({
          nome: data.nome || '',
          sigla: data.sigla || '',
          endereco: data.endereco || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          telefone: data.telefone || '',
          email: data.email || '',
          diretor_id: data.diretor_id || '',
        });
      }
    } catch (error) {
      toast.error('Erro ao carregar escola');
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
      await fetch('/api/admin/escola', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success('Salvo');
      fetchEscola();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Configurar Escola</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="input-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sigla</label>
              <input
                value={formData.sigla}
                onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Endereço</label>
            <input
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              className="input-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <input
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <input
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="input-base"
              />
            </div>
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
            <label className="block text-sm font-medium mb-1">Diretor</label>
            <select
              value={formData.diretor_id}
              onChange={(e) => setFormData({ ...formData, diretor_id: e.target.value })}
              className="select-base"
            >
              <option value="">Selecione um diretor</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary w-full">Salvar</button>
        </form>
      </div>
    </div>
  );
}
