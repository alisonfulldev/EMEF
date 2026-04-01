'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CalendarioPage() {
  const [eventos, setEventos] = useState([
    {
      data: '2024-02-12',
      titulo: 'Carnaval',
      tipo: 'feriado',
    },
    {
      data: '2024-04-21',
      titulo: 'Tiradentes',
      tipo: 'feriado',
    },
  ]);
  const [formData, setFormData] = useState({
    data: '',
    titulo: '',
    tipo: 'evento' as 'evento' | 'feriado' | 'recessao',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.data || !formData.titulo) {
      toast.error('Preencha os campos');
      return;
    }
    setEventos([...eventos, formData]);
    setFormData({ data: '', titulo: '', tipo: 'evento' });
    toast.success('Evento adicionado');
  };

  const handleDelete = (index: number) => {
    setEventos(eventos.filter((_, i) => i !== index));
    toast.success('Removido');
  };

  const getTipoBadge = (tipo: string) => {
    const colors = {
      feriado: 'badge-danger',
      recessao: 'badge-warning',
      evento: 'badge-info',
    };
    return colors[tipo as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendário Escolar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold mb-4">Adicionar Evento</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input
                type="date"
                required
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                placeholder="Ex: Carnaval"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                className="select-base"
              >
                <option value="evento">Evento</option>
                <option value="feriado">Feriado</option>
                <option value="recessao">Recessão</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">Adicionar</button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="font-bold mb-4">Eventos Cadastrados</h2>
          <div className="space-y-2">
            {eventos.length === 0 ? (
              <p className="text-slate-600">Nenhum evento cadastrado</p>
            ) : (
              eventos.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50">
                  <div>
                    <p className="font-medium">{e.titulo}</p>
                    <p className="text-sm text-slate-600">{e.data}</p>
                    <span className={getTipoBadge(e.tipo)}>{e.tipo}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-600 px-3 py-1 hover:bg-red-50 rounded"
                  >
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
