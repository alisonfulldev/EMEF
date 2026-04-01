'use client';

import { useEffect, useState } from 'react';
import { Calendar, BookOpen, BarChart3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ProfessorDashboard() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const response = await fetch('/api/professor/turmas');
          const data = await response.json();
          setTurmas(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar turmas');
      } finally {
        setLoading(false);
      }
    };

    fetchTurmas();
  }, [supabase]);

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
                  <p className="text-slate-600 text-sm font-medium">Minhas Turmas</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{turmas.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <BookOpen size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Aulas Registradas</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
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
                  <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <BarChart3 size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Minhas Turmas</h2>
            {turmas.length === 0 ? (
              <p className="text-slate-600 text-center py-8">Você não tem turmas atribuídas</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {turmas.map((turma: any) => (
                  <div
                    key={turma.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <h3 className="font-semibold text-slate-900">{turma.nome}</h3>
                    <p className="text-sm text-slate-600 mt-1">Turno: {turma.turno}</p>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/professor/chamada`}
                        className="text-sm px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        Registrar Chamada
                      </a>
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
