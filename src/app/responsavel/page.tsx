'use client';

import { useEffect, useState } from 'react';
import { Users, FileText, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ResponsavelDashboard() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await fetch('/api/responsavel/alunos');
        const data = await response.json();
        setAlunos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar dados dos alunos');
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Acompanhe o desempenho de seus filhos</p>
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
                  <p className="text-slate-600 text-sm font-medium">Meus Filhos</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{alunos.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Justificativas Enviadas</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <FileText size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Alertas de Frequência</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Meus Filhos</h2>
            {alunos.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                Você não tem filhos vinculados ao sistema
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alunos.map((aluno: any) => (
                  <div
                    key={aluno.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <h3 className="font-semibold text-slate-900">{aluno.nome_completo}</h3>
                    <p className="text-sm text-slate-600 mt-1">Matrícula: {aluno.matricula}</p>
                    <p className="text-sm text-slate-600">Turma: {aluno.turma_nome || 'N/A'}</p>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/responsavel/${aluno.id}`}
                        className="text-sm px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        Ver Histórico
                      </a>
                      <a
                        href="/responsavel/justificativas"
                        className="text-sm px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                      >
                        Enviar Justificativa
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
