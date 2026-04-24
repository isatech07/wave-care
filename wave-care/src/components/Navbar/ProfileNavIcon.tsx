'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

function ProfileNavIcon() {
  const router = useRouter();
  const { isLoggedIn, user } = useUser();

  function handleProfileClick() {
    if (isLoggedIn) {
      router.push('/perfil');
    } else {
      router.push('/auth');
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
          {user?.nome?.[0]?.toUpperCase() ?? 'U'}
        </div>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      )}
    </button>
  );
}

export default ProfileNavIcon;