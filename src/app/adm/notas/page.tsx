'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function NotasPage() {
  const [notas, setNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    try {
      const res = await fetch('/api/adm/notas');
      const data = await res.json();
      setNotas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro');
    } finally {
      setLoading(false);
    }
  };

  const getSituacao = (nota: number) => {
    if (nota >= 7) return { texto: 'Aprovado', classe: 'badge-success' };
    if (nota >= 5) return { texto: 'Recuperação', classe: 'badge-warning' };
    return { texto: 'Reprovado', classe: 'badge-danger' };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notas e Avaliações</h1>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-stripe text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Aluno</th>
                  <th className="px-4 py-2 text-left font-semibold">Disciplina</th>
                  <th className="px-4 py-2 text-left font-semibold">Turma</th>
                  <th className="px-4 py-2 text-left font-semibold">Bimestre</th>
                  <th className="px-4 py-2 text-center font-semibold">Nota</th>
                  <th className="px-4 py-2 text-center font-semibold">Situação</th>
                </tr>
              </thead>
              <tbody>
                {notas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-600">
                      Nenhuma nota registrada
                    </td>
                  </tr>
                ) : (
                  notas.map((nota) => {
                    const sit = getSituacao(nota.nota);
                    return (
                      <tr key={nota.id}>
                        <td className="px-4 py-3 font-medium">{nota.aluno_nome}</td>
                        <td className="px-4 py-3">{nota.disciplina_nome}</td>
                        <td className="px-4 py-3">{nota.turma_nome}</td>
                        <td className="px-4 py-3">{nota.bimestre}º</td>
                        <td className="px-4 py-3 text-center font-bold">{nota.nota}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={sit.classe}>{sit.texto}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
