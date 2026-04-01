import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user already exists in usuarios table
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('id')
          .eq('id', user.id)
          .single();

        // If user doesn't exist, create it with a default role
        if (!usuario) {
          await supabase.from('usuarios').insert({
            id: user.id,
            email: user.email,
            nome: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            perfil: 'admin', // Default role - should be changed by admin
            ativo: true,
            foto_url: user.user_metadata?.avatar_url,
          });
        }
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    new URL('/auth/login?error=Could not authenticate user', request.url)
  );
}
