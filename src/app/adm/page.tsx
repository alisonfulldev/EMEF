'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  AlertCircle,
  FileText,
  BarChart3,
  TrendingDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function AdmDashboard() {
  const [stats, setStats] = useState({
    total_alunos: 0,
    total_turmas: 0,
    total_professores: 0,
    alunos_com_alerta: 0,
    justificativas_pendentes: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [alunosRes, turmasRes, professoresRes] = await Promise.all([
          fetch('/api/adm/alunos'),
          fetch('/api/admin/turmas'),
          fetch('/api/admin/professores'),
        ]);

        const alunos = await alunosRes.json();
        const turmas = await turmasRes.json();
        const professores = await professoresRes.json();

        setStats({
          total_alunos: Array.isArray(alunos) ? alunos.length : 0,
          total_turmas: Array.isArray(turmas) ? turmas.length : 0,
          total_professores: Array.isArray(professores) ? professores.length : 0,
          alunos_com_alerta: 0,
          justificativas_pendentes: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Bem-vindo ao painel de administração</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              icon={Users}
              label="Total de Alunos"
              value={stats.total_alunos}
              color="#3b82f6"
            />
            <StatCard
              icon={BookOpen}
              label="Total de Turmas"
              value={stats.total_turmas}
              color="#10b981"
            />
            <StatCard
              icon={Users}
              label="Total de Professores"
              value={stats.total_professores}
              color="#8b5cf6"
            />
            <StatCard
              icon={AlertCircle}
              label="Alunos com Alerta"
              value={stats.alunos_com_alerta}
              color="#f59e0b"
            />
            <StatCard
              icon={FileText}
              label="Justificativas Pendentes"
              value={stats.justificativas_pendentes}
              color="#ef4444"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingDown size={20} />
                Ações Rápidas
              </h2>
              <div className="space-y-3">
                <a
                  href="/admin/alunos"
                  className="block p-3 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                >
                  Gerenciar Alunos
                </a>
                <a
                  href="/admin/turmas"
                  className="block p-3 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                >
                  Gerenciar Turmas
                </a>
                <a
                  href="/admin/professores"
                  className="block p-3 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
                >
                  Gerenciar Professores
                </a>
                <a
                  href="/adm/justificativas"
                  className="block p-3 bg-orange-50 text-orange-600 rounded hover:bg-orange-100 transition-colors"
                >
                  Aprovar Justificativas
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Informações do Sistema
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-600">Versão</p>
                  <p className="font-medium text-slate-900">1.0.0</p>
                </div>
                <div>
                  <p className="text-slate-600">Escola</p>
                  <p className="font-medium text-slate-900">E.M. Narandiba</p>
                </div>
                <div>
                  <p className="text-slate-600">Banco de Dados</p>
                  <p className="font-medium text-slate-900">PostgreSQL (Supabase)</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
