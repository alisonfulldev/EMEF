import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Get user profile
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('perfil')
    .eq('id', user.id)
    .single();

  // Redirect based on role
  if (!usuario) {
    redirect('/auth/login');
  }

  const perfil = usuario.perfil;

  if (perfil === 'professor') {
    redirect('/professor');
  } else if (perfil === 'responsavel') {
    redirect('/responsavel');
  } else if (perfil === 'cozinha') {
    redirect('/cozinha');
  } else if (perfil === 'admin' || perfil === 'secretaria' || perfil === 'diretor') {
    redirect('/adm');
  }

  redirect('/auth/login');
}
