'use client';

import { useEffect, useState } from 'react';
import { Users, UtensilsCrossed, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface PresencaData {
  turma: string;
  total_alunos: number;
  presentes: number;
  faltas: number;
  atrasos: number;
  taxa_presenca: number;
}

export default function AlunosPresentes() {
  const [dados, setDados] = useState<PresencaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPresentes, setTotalPresentes] = useState(0);

  const fetchPresentes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cozinha/presentes-hoje');
      if (!response.ok) throw new Error('Erro ao buscar dados');

      const data = await response.json();
      setDados(data.por_turma);
      setTotalPresentes(data.total_presentes);
      toast.success('Dados atualizados');
    } catch (error) {
      toast.error('Erro ao carregar dados de presença');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">Alunos Presentes Hoje</h1>
        </div>
        <button
          onClick={fetchPresentes}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Total Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium mb-2">🍽️ Total de Alunos para Refeição</p>
            <p className="text-6xl font-bold">{totalPresentes}</p>
            <p className="text-green-100 text-sm mt-2">alunos presentes na escola</p>
          </div>
          <UtensilsCrossed className="w-20 h-20 opacity-20" />
        </div>
      </div>

      {/* Tabela por Turma */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Detalhamento por Turma</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Turma</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Total de Alunos</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-green-700">✅ Presentes</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-red-700">❌ Faltas</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-yellow-700">⏰ Atrasos</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Taxa Presença</th>
              </tr>
            </thead>
            <tbody>
              {dados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <p className="text-lg">Nenhuma turma com presença registrada</p>
                    <p className="text-sm text-slate-400 mt-1">Os professores ainda não fizeram a chamada</p>
                  </td>
                </tr>
              ) : (
                dados.map((turma) => (
                  <tr key={turma.turma} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                        {turma.turma}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-slate-900">{turma.total_alunos}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-base font-bold bg-green-100 text-green-800">
                        {turma.presentes}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-base font-bold bg-red-100 text-red-800">
                        {turma.faltas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-base font-bold bg-yellow-100 text-yellow-800">
                        {turma.atrasos}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              turma.taxa_presenca >= 80
                                ? 'bg-green-500'
                                : turma.taxa_presenca >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${turma.taxa_presenca}%` }}
                          />
                        </div>
                        <span className="text-base font-bold text-slate-900 w-14 text-right">
                          {turma.taxa_presenca}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <span className="font-bold">✅ Alunos Presentes:</span> Use este número para preparar as refeições
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-bold">🔄 Atualizar:</span> Clique em "Atualizar" para ver os dados mais recentes
          </p>
        </div>
      </div>
    </div>
  );
}
