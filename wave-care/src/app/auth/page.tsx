'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Poppins, Playfair_Display } from 'next/font/google';
import styles from './auth.module.css';
import { useUser } from '@/contexts/UserContext';
import { apiLogin, apiRegister } from '@/lib/api';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-title',
});

export default function AuthPage() {
  const { login } = useUser();
  const router = useRouter();

  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // ── LOGIN real ──────────────────────────────
        const userData = await apiLogin(formData.email, formData.password);
        login({
          nome: userData.nome || userData.name,
          email: userData.email,
          telefone: userData.telefone || '',
          cidade: userData.cidade || '',
          capilar: null,
          id: userData.id,
        });
      } else {
        // ── CADASTRO real ───────────────────────────
        await apiRegister(formData.name, formData.email, formData.password);
        // Após cadastrar, faz login automático
        const userData = await apiLogin(formData.email, formData.password);
        login({
          nome: userData.nome || userData.name,
          email: userData.email,
          telefone: userData.telefone || '',
          cidade: userData.cidade || '',
          capilar: null,
          id: userData.id,
        });
      }

      router.push('/perfil');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`${styles.wrapper} ${poppins.variable} ${playfair.variable}`}>
      <div className={styles.card}>

        {/* Lado esquerdo: imagem */}
        <div className={styles.imagePanel}>
          <Image
            src="/login-cadastro.png"
            alt="Wave Care"
            fill
            className={styles.photo}
            priority
          />
          <div className={styles.imageOverlay} />
        </div>

        {/* Lado direito: formulário */}
        <div className={styles.formPanel}>
          <div className={styles.formInner}>

            <h1 className={styles.brand}>Wave Care</h1>
            <h2 className={styles.title}>
              {isLogin ? 'Acesse a sua conta' : 'Crie sua conta'}
            </h2>

            {/* Botão Google */}
            <button
              type="button"
              className={styles.googleBtn}
              onClick={() => console.log('Google OAuth')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              {isLogin ? 'Entrar com o Google' : 'Cadastrar com o Google'}
            </button>

            <div className={styles.divider}>
              <span>{isLogin ? 'Ou faça login com e-mail' : 'Ou cadastre com e-mail'}</span>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {!isLogin && (
                <div className={styles.field}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className={styles.input}
                  />
                </div>
              )}

              <div className={styles.field}>
                <input
                  type="email"
                  name="email"
                  placeholder="Insira seu e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={styles.input}
                />
              </div>

              <div className={`${styles.field} ${styles.fieldPassword}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Insira sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Mensagem de erro da API */}
              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '0.25rem 0 0', fontWeight: 500 }}>
                  {error}
                </p>
              )}

              {isLogin && (
                <div className={styles.forgotRow}>
                  <Link href="/auth/recuperar-senha" className={styles.forgotLink}>
                    Esqueceu sua senha?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    {isLogin ? 'Entrar' : 'Continuar com o e-mail'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className={styles.toggleText}>
              {isLogin ? (
                <>
                  Não tem uma conta?{' '}
                  <button className={styles.toggleBtn} onClick={() => setMode('cadastro')}>
                    Criar conta grátis
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{' '}
                  <button className={styles.toggleBtn} onClick={() => setMode('login')}>
                    entrar
                  </button>
                </>
              )}
            </p>

            <p className={styles.legal}>
              Ao acessar os serviços da Wave Care você concorda com nossas{' '}
              <Link href="/privacidade">Políticas de Privacidade</Link>{' '}e{' '}
              <Link href="/termos">Termos de Uso</Link>.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}