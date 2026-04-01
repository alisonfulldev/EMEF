'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function HistoricoAluno() {
  const params = useParams();
  const alunoId = params.alunoId as string;
  const [aluno, setAluno] = useState<any>(null);
  const [frequencia, setFrequencia] = useState<any>(null);
  const [notas, setNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDados();
  }, [alunoId]);

  const fetchDados = async () => {
    try {
      const [alunoRes, freqRes, notasRes] = await Promise.all([
        fetch(`/api/responsavel/alunos/${alunoId}`),
        fetch(`/api/responsavel/alunos/${alunoId}/frequencia`),
        fetch(`/api/responsavel/alunos/${alunoId}/notas`),
      ]);

      const [alunoData, freqData, notasData] = await Promise.all([
        alunoRes.json(),
        freqRes.json(),
        notasRes.json(),
      ]);

      setAluno(alunoData);
      setFrequencia(freqData);
      setNotas(Array.isArray(notasData) ? notasData : []);
    } catch (error) {
      toast.error('Erro');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (!aluno) return <div className="text-center py-8">Aluno não encontrado</div>;

  const getFrequenciaColor = (freq: number) => {
    if (freq >= 75) return 'text-green-600';
    if (freq >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{aluno.nome_completo}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-slate-600 mb-1">Matrícula</p>
          <p className="font-semibold text-lg">{aluno.matricula}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-slate-600 mb-1">Turma</p>
          <p className="font-semibold text-lg">{aluno.turma_nome}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm text-slate-600 mb-1">Frequência</p>
          <p className={`font-semibold text-2xl ${getFrequenciaColor(frequencia?.taxa || 0)}`}>
            {frequencia?.taxa || 0}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Notas por Disciplina</h2>
        {notas.length === 0 ? (
          <p className="text-slate-600">Nenhuma nota registrada</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notas.map((nota) => (
              <div key={nota.id} className="border rounded-lg p-4">
                <p className="font-semibold mb-2">{nota.disciplina_nome}</p>
                <div className="space-y-1">
                  {[1, 2, 3, 4].map((b) => {
                    const n = notas.find((x) => x.bimestre === b);
                    return (
                      <div key={b} className="flex justify-between text-sm">
                        <span className="text-slate-600">{b}º Bimestre:</span>
                        <span className="font-medium">{n?.nota || '-'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
