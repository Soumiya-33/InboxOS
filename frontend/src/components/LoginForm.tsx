import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from './AuthLayout';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import {
  Sparkles,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from 'lucide-react';

const GoogleIcon = () => (
  <svg
    className="w-4.5 h-4.5"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const LoginForm: React.FC = () => {
  const { login, loginWithFirebase, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const caps = e.getModifierState('CapsLock');
    setIsCapsLockOn(caps);
  };

  const validate = () => {
    let isValid = true;
    if (!email) { setEmailError('Email is required'); isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Please enter a valid email address'); isValid = false; }
    else { setEmailError(null); }

    if (!password) { setPasswordError('Password is required'); isValid = false; }
    else if (password.length < 6) { setPasswordError('Password must be at least 6 characters'); isValid = false; }
    else { setPasswordError(null); }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // shared input style
  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    backgroundColor: 'var(--color-surface)',
    border: `1px solid ${hasError ? 'var(--color-danger)' : 'var(--color-ink)'}`,
    color: 'var(--color-ink)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    padding: '10px 14px',
    outline: 'none',
    boxShadow: hasError ? '3px 3px 0 var(--color-danger)' : undefined,
  });

  return (
    <AuthLayout>
      <div className="w-full space-y-5">
        {/* Welcome */}
        <div className="space-y-2 text-left">
          <h3
            className="text-2xl font-black tracking-tight flex items-center gap-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Welcome Back <Sparkles size={18} style={{ color: 'var(--color-accent-cta)' }} />
          </h3>
          <p className="text-xs" style={{ color: '#666', fontFamily: 'var(--font-body)' }}>
            Sign in to your AI Inbox Operating System.
          </p>
        </div>

        {/* Google Authentication */}
        <button
          type="button"
          onClick={async () => {
            if (!isFirebaseConfigured) {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                login('demo@inboxos.dev', 'password123').then(() => navigate('/dashboard'));
              }, 1000);
              return;
            }
            setIsLoading(true);
            try {
              const result = await signInWithPopup(auth, googleProvider);
              const idToken = await result.user.getIdToken();
              await loginWithFirebase(idToken);
              navigate('/dashboard');
            } catch (err: any) {
              console.error('Google sign-in error:', err);
            } finally {
              setIsLoading(false);
            }
          }}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all min-h-[44px]"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-ink)',
            color: 'var(--color-ink)',
            boxShadow: 'var(--shadow-offset)',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset-hover)';
            (e.currentTarget as HTMLElement).style.transform = 'translate(3px,3px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset)';
            (e.currentTarget as HTMLElement).style.transform = '';
          }}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow" style={{ borderTop: '1px solid var(--color-ink)' }} />
          <span
            className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: '#888', fontFamily: 'var(--font-body)' }}
          >
            or continue with email
          </span>
          <div className="flex-grow" style={{ borderTop: '1px solid var(--color-ink)' }} />
        </div>

        {/* Auth Error Alert */}
        {authError && (
          <div
            className="flex items-center gap-3 p-3.5 text-xs text-left"
            style={{
              backgroundColor: '#FFF0F0',
              border: '1px solid var(--color-danger)',
              color: 'var(--color-danger)',
              boxShadow: '3px 3px 0 var(--color-danger)',
            }}
          >
            <AlertCircle size={14} className="shrink-0" />
            <p className="leading-snug">{authError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5 text-left">
            <label
              className="text-[10px] font-bold uppercase tracking-widest block"
              style={{ color: '#444', fontFamily: 'var(--font-body)' }}
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3" style={{ color: '#777' }}>
                <Mail size={15} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                disabled={isLoading}
                style={{ ...inputStyle(!!emailError), paddingLeft: '36px' }}
              />
            </div>
            {emailError && (
              <p className="text-[10px] flex items-center gap-1.5 mt-1 font-bold pl-1" style={{ color: 'var(--color-danger)' }}>
                <AlertCircle size={10} />
                <span>{emailError}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <label
                className="text-[10px] font-bold uppercase tracking-widest block"
                style={{ color: '#444', fontFamily: 'var(--font-body)' }}
              >
                Password
              </label>
              <a
                href="#"
                className="text-[9px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: 'var(--color-accent-cta)' }}
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3" style={{ color: '#777' }}>
                <Lock size={15} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onKeyDown={handleKeyDown}
                onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(null); }}
                disabled={isLoading}
                style={{ ...inputStyle(!!passwordError), paddingLeft: '36px', paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-3 transition-colors"
                style={{ color: '#777' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {isCapsLockOn && (
              <p className="text-[9px] flex items-center gap-1.5 mt-1 font-bold pl-1 uppercase" style={{ color: 'var(--color-pending)' }}>
                <AlertCircle size={9} />
                <span>Warning: Caps Lock is On</span>
              </p>
            )}
            {passwordError && (
              <p className="text-[10px] flex items-center gap-1.5 mt-1 font-bold pl-1" style={{ color: 'var(--color-danger)' }}>
                <AlertCircle size={10} />
                <span>{passwordError}</span>
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 min-h-[44px]"
            style={{
              backgroundColor: 'var(--color-accent-cta)',
              border: '1px solid var(--color-ink)',
              color: '#fff',
              boxShadow: 'var(--shadow-offset)',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => {
              if (!isLoading) {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset-hover)';
                (e.currentTarget as HTMLElement).style.transform = 'translate(3px,3px)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset)';
              (e.currentTarget as HTMLElement).style.transform = '';
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          className="text-center pt-4 text-[10px] font-semibold"
          style={{ borderTop: '1px solid var(--color-ink)', color: '#666', fontFamily: 'var(--font-body)' }}
        >
          <p>Join thousands of users running email as an operating system.</p>
          <Link
            to="/register"
            onClick={clearError}
            className="font-bold uppercase tracking-wider mt-1 block transition-colors"
            style={{ color: 'var(--color-accent-cta)' }}
          >
            Create an Account →
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
