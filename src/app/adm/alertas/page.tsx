'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AlertaFrequencia {
  aluno_id: string;
  aluno_nome: string;
  turma_nome: string;
  frequencia: number;
  total_faltas: number;
  total_aulas: number;
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<AlertaFrequencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      const res = await fetch('/api/adm/alertas');
      const data = await res.json();
      setAlertas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  };

  const getFrequenciaColor = (freq: number) => {
    if (freq >= 75) return 'text-green-600';
    if (freq >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Alertas de Frequência</h1>
      <p className="text-slate-600">Alunos com baixa frequência (&lt; 75%)</p>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="grid gap-4">
          {alertas.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-800">✓ Todos os alunos têm frequência satisfatória</p>
            </div>
          ) : (
            alertas.map((alerta) => (
              <div
                key={alerta.aluno_id}
                className="bg-white border border-red-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={20} className="text-red-600" />
                      <h3 className="font-bold text-lg">{alerta.aluno_nome}</h3>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">Turma: {alerta.turma_nome}</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-slate-600">Frequência</p>
                        <p className={`text-2xl font-bold ${getFrequenciaColor(alerta.frequencia)}`}>
                          {alerta.frequencia}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Aulas Totais</p>
                        <p className="text-2xl font-bold text-slate-900">{alerta.total_aulas}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Faltas</p>
                        <p className="text-2xl font-bold text-red-600">{alerta.total_faltas}</p>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`/adm/alunos/${alerta.aluno_id}`}
                    className="btn-primary text-sm ml-4"
                  >
                    Ver Perfil
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
