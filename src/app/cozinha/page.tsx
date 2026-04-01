'use client';

import { useEffect, useState } from 'react';
import { Users, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';

interface PresencaData {
  turma: string;
  total_alunos: number;
  presentes: number;
  faltas: number;
  atrasos: number;
  taxa_presenca: number;
}

export default function CozinhaDashboard() {
  const [dados, setDados] = useState<PresencaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPresentes, setTotalPresentes] = useState(0);

  useEffect(() => {
    const fetchPresentes = async () => {
      try {
        const response = await fetch('/api/cozinha/presentes-hoje');
        if (!response.ok) throw new Error('Erro ao buscar dados');

        const data = await response.json();
        setDados(data.por_turma);
        setTotalPresentes(data.total_presentes);
      } catch (error) {
        toast.error('Erro ao carregar dados de presença');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

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
      <div className="flex items-center gap-3">
        <UtensilsCrossed className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900">Cozinha - Presença de Alunos</h1>
      </div>

      {/* Total Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">Total de Alunos Presentes</p>
            <p className="text-5xl font-bold">{totalPresentes}</p>
          </div>
          <Users className="w-16 h-16 opacity-20" />
        </div>
      </div>

      {/* Tabela por Turma */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Presença por Turma</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Turma</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-green-700">Presentes</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-red-700">Faltas</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-yellow-700">Atrasos</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Taxa (%)</th>
              </tr>
            </thead>
            <tbody>
              {dados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Nenhum dado de presença disponível
                  </td>
                </tr>
              ) : (
                dados.map((turma) => (
                  <tr key={turma.turma} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{turma.turma}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{turma.total_alunos}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {turma.presentes}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        {turma.faltas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {turma.atrasos}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              turma.taxa_presenca >= 80
                                ? 'bg-green-500'
                                : turma.taxa_presenca >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${turma.taxa_presenca}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 w-12 text-right">
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

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 Dica:</span> Esta tela é atualizada automaticamente quando os professores registram a chamada. O total de alunos presentes é usado para preparar a quantidade ideal de alimentos.
        </p>
      </div>
    </div>
  );
}
