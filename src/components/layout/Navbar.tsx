'use client';

import { LogOut, Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Usuario } from '@/types';

interface NavbarProps {
  usuario?: Usuario;
  toggleSidebar?: () => void;
}

export default function Navbar({ usuario, toggleSidebar }: NavbarProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const getPerfilLabel = (perfil?: string) => {
    const labels: { [key: string]: string } = {
      professor: 'Professor',
      responsavel: 'Responsável',
      admin: 'Administrador',
      secretaria: 'Secretaria',
      diretor: 'Diretor',
    };
    return labels[perfil || ''] || perfil || '';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-md"
                title="Menu"
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900">
              Diário Escolar
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {usuario && (
              <>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{usuario.nome}</p>
                    <p className="text-xs text-slate-500">
                      {getPerfilLabel(usuario.perfil)}
                    </p>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 hover:bg-slate-100 rounded-md"
              title="Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="sm:hidden pb-4 border-t border-slate-200">
            {usuario && (
              <>
                <div className="px-4 py-3 bg-slate-50 rounded mb-4">
                  <p className="text-sm font-medium text-slate-900">{usuario.nome}</p>
                  <p className="text-xs text-slate-500">
                    {getPerfilLabel(usuario.perfil)}
                  </p>
                </div>
              </>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600
                hover:bg-red-50 rounded-md transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
