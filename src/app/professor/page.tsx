'use client';

import { useEffect, useState } from 'react';
import { Calendar, BookOpen, BarChart3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ProfessorDashboard() {
  const [aulas, setAulas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const response = await fetch('/api/admin/aulas');
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setAulas(data);
        } else {
          setAulas([]);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar aulas');
      } finally {
        setLoading(false);
      }
    };

    fetchAulas();
  }, []);

  const aulasAgrupadas = aulas.reduce((acc: Record<string, any[]>, aula: any) => {
    if (!acc[aula.turma_id]) {
      acc[aula.turma_id] = [];
    }
    acc[aula.turma_id].push(aula);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Bem-vindo, Professor!</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Minhas Aulas</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{aulas.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <BookOpen size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Turmas</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{Object.keys(aulasAgrupadas).length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Calendar size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Avaliações Criadas</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">-</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <BarChart3 size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Minhas Aulas</h2>
            {aulas.length === 0 ? (
              <p className="text-slate-600 text-center py-8">Você não tem aulas atribuídas</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(aulasAgrupadas).map(([turmaId, turmaAulas]: [string, any]) => (
                  <div key={turmaId}>
                    <h3 className="font-semibold text-slate-900 mb-3">Turma {turmaId}</h3>
                    <div className="space-y-2">
                      {(turmaAulas as any[]).map((aula: any) => (
                        <div
                          key={aula.id}
                          className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-slate-900">{aula.data} - {aula.horario_inicio}</p>
                            <p className="text-sm text-slate-600">Sala {aula.sala || 'N/A'}</p>
                          </div>
                          <a
                            href={`/professor/chamada/${aula.id}`}
                            className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Registrar Chamada
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
