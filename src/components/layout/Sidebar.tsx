'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Perfil } from '@/types';

interface SidebarProps {
  perfil?: Perfil;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ perfil, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        href: perfil === 'admin' || perfil === 'secretaria' ? '/adm' : `/${perfil}`,
        icon: LayoutDashboard,
      },
    ];

    if (perfil === 'admin' || perfil === 'secretaria' || perfil === 'diretor') {
      return [
        ...baseItems,
        {
          label: 'Gestão',
          items: [
            { label: 'Alunos', href: '/admin/alunos', icon: Users },
            { label: 'Turmas', href: '/admin/turmas', icon: BookOpen },
            { label: 'Disciplinas', href: '/admin/disciplinas', icon: FileText },
            { label: 'Professores', href: '/admin/professores', icon: Users },
            { label: 'Responsáveis', href: '/admin/responsaveis', icon: Users },
            { label: 'Usuários', href: '/admin/usuarios', icon: Users },
            { label: 'Aulas', href: '/admin/aulas', icon: BookOpen },
            { label: 'Escola', href: '/admin/escola', icon: Settings },
            { label: 'Ano Letivo', href: '/admin/ano-letivo', icon: Settings },
          ],
        },
        {
          label: 'Relatórios',
          items: [
            { label: 'Alertas', href: '/adm/alertas', icon: BarChart3 },
            { label: 'Notas', href: '/adm/notas', icon: BarChart3 },
            { label: 'Justificativas', href: '/adm/justificativas', icon: CheckCircle },
          ],
        },
      ];
    } else if (perfil === 'professor') {
      return [
        ...baseItems,
        {
          label: 'Aulas',
          items: [
            { label: 'Chamada', href: '/professor/chamada', icon: CheckCircle },
            { label: 'Notas', href: '/professor/notas', icon: BarChart3 },
            { label: 'Avaliações', href: '/professor/avaliacoes', icon: FileText },
          ],
        },
      ];
    } else if (perfil === 'responsavel') {
      return [
        ...baseItems,
        {
          label: 'Consultas',
          items: [
            { label: 'Justificativas', href: '/responsavel/justificativas', icon: FileText },
          ],
        },
      ];
    } else if (perfil === 'cozinha') {
      return [
        ...baseItems,
        {
          label: 'Presença',
          items: [
            { label: 'Alunos Presentes', href: '/cozinha/alunos-presentes', icon: Users },
          ],
        },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const isActive = (href: string) => {
    if (href === '/adm' || href === '/admin' || href === '/professor' || href === '/responsavel' || href === '/cozinha') {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200',
          'overflow-y-auto transition-transform duration-300',
          'lg:translate-x-0 z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item: any) => (
            <div key={item.label}>
              {item.items ? (
                <>
                  <p className="text-xs font-semibold text-slate-500 uppercase px-3 py-2 mt-4">
                    {item.label}
                  </p>
                  <div className="space-y-1">
                    {item.items.map((subItem: any) => {
                      const Icon = subItem.icon;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                            isActive(subItem.href)
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-slate-600 hover:bg-slate-50'
                          )}
                          onClick={onClose}
                        >
                          <Icon size={18} />
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                  onClick={onClose}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout button */}
        <div className="border-t border-slate-200 p-4 mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600
              hover:bg-red-50 rounded-md transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
