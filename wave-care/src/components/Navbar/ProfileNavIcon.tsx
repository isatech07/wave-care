'use client';

// Exemplo de como integrar o ícone de perfil na Navbar
// Coloque este trecho dentro do seu componente Navbar existente.
//
// Se estiver usando NextAuth:  npm install next-auth
// Se estiver usando Supabase:  npm install @supabase/supabase-js @supabase/ssr

import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react'; // NextAuth
// import { useSupabase } from '@/lib/supabase/client'; // Supabase (exemplo)

// ─────────────────────────────────────────────
// Snippet para dentro do seu <Navbar /> existente
// ─────────────────────────────────────────────

function ProfileNavIcon() {
  const router = useRouter();

  // ── Opção A: NextAuth ──────────────────────
  // const { data: session } = useSession();
  // const isLoggedIn = !!session?.user;
  // const userImage = session?.user?.image;
  // const userName = session?.user?.name;

  // ── Opção B: estado local simples (para teste) ──
  const isLoggedIn = false; // troque por seu estado real de autenticação

  function handleProfileClick() {
    if (isLoggedIn) {
      router.push('/conta'); // página da conta do usuário
    } else {
      router.push('/auth'); // página de login/cadastro
    }
  }

  return (
    <button
      onClick={handleProfileClick}
      aria-label={isLoggedIn ? 'Minha conta' : 'Entrar'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: 'inherit',
        padding: '0.25rem',
      }}
    >
      {isLoggedIn ? (
        // Usuário logado: mostra avatar ou inicial
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#7aab9a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 700,
        }}>
          {/* userImage
            ? <img src={userImage} alt={userName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            : userName?.[0]?.toUpperCase() */}
          U
        </div>
      ) : (
        // Usuário deslogado: ícone de perfil genérico
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      )}
    </button>
  );
}

export default ProfileNavIcon;
