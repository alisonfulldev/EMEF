'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AlunoPerfil() {
  const params = useParams();
  const alunoId = params.alunoId as string;
  const [aluno, setAluno] = useState<any>(null);
  const [frequencia, setFrequencia] = useState<any>(null);
  const [notas, setNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlunoPerfil();
  }, [alunoId]);

  const fetchAlunoPerfil = async () => {
    try {
      const responses = await Promise.all([
        fetch(`/api/adm/alunos/${alunoId}`),
        fetch(`/api/adm/alunos/${alunoId}/frequencia`),
        fetch(`/api/adm/alunos/${alunoId}/notas`),
      ]);

      const [alunoData, freqData, notasData] = await Promise.all(
        responses.map((r) => r.json())
      );

      setAluno(alunoData);
      setFrequencia(freqData);
      setNotas(Array.isArray(notasData) ? notasData : []);
    } catch (error) {
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (!aluno) {
    return <div className="text-center py-8">Aluno não encontrado</div>;
  }

  const getFrequenciaColor = (freq: number) => {
    if (freq >= 75) return 'text-green-600';
    if (freq >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Link href="/adm" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
        <ArrowLeft size={20} />
        Voltar
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-2">{aluno.nome_completo}</h1>
        <p className="text-slate-600 mb-6">Matrícula: {aluno.matricula}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="border rounded p-4">
            <p className="text-sm text-slate-600">Data de Nascimento</p>
            <p className="font-semibold">{aluno.data_nascimento || 'N/A'}</p>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm text-slate-600">Nº Chamada</p>
            <p className="font-semibold">{aluno.numero_chamada}</p>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm text-slate-600">Status</p>
            <p className={`font-semibold ${aluno.ativo ? 'text-green-600' : 'text-red-600'}`}>
              {aluno.ativo ? 'Ativo' : 'Inativo'}
            </p>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm text-slate-600">Frequência Geral</p>
            <p className={`text-2xl font-bold ${getFrequenciaColor(frequencia?.taxa || 0)}`}>
              {frequencia?.taxa || 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Notas por Disciplina</h2>
        {notas.length === 0 ? (
          <p className="text-slate-600">Nenhuma nota registrada</p>
        ) : (
          <div className="space-y-3">
            {notas.map((nota) => (
              <div key={nota.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{nota.disciplina_nome}</p>
                  <p className="text-sm text-slate-600">{nota.bimestre}º Bimestre</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{nota.nota}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
