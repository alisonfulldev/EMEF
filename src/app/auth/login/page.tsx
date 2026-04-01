'use client';

import { GitHub } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const supabase = createClient();

  const handleGitHubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || 'Erro ao fazer login');
      }
    } catch (err) {
      toast.error('Erro ao conectar com GitHub');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Diário Escolar
          </h1>
          <p className="text-slate-600">Narandiba</p>
        </div>

        <div className="mb-8">
          <p className="text-center text-slate-600 text-sm mb-6">
            Faça login com sua conta GitHub para acessar o sistema
          </p>

          <button
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3
              bg-slate-900 text-white rounded-lg font-medium
              hover:bg-slate-800 transition-colors"
          >
            <GitHub size={20} />
            Entrar com GitHub
          </button>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-500 text-center">
            Sistema de Gestão Escolar - Escola Municipal de Narandiba
          </p>
        </div>
      </div>
    </div>
  );
}
