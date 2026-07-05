import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from './AuthLayout';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import {
  UserCheck,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { register, loginWithFirebase, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  const getPasswordStrength = () => {
    if (!password) return { label: '', score: 0, colorBg: 'transparent' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (score <= 2) return { label: 'Weak', score: 1, colorBg: 'var(--color-danger)' };
    if (score <= 4) return { label: 'Medium', score: 2, colorBg: 'var(--color-pending)' };
    return { label: 'Strong', score: 3, colorBg: 'var(--color-success)' };
  };

  const strength = getPasswordStrength();

  const validate = () => {
    let isValid = true;
    if (!email) { setEmailError('Email is required'); isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Please enter a valid email address'); isValid = false; }
    else { setEmailError(null); }

    if (!password) { setPasswordError('Password is required'); isValid = false; }
    else if (password.length < 6) { setPasswordError('Password must be at least 6 characters'); isValid = false; }
    else { setPasswordError(null); }

    if (!confirmPassword) { setConfirmPasswordError('Please confirm your password'); isValid = false; }
    else if (password !== confirmPassword) { setConfirmPasswordError('Passwords do not match'); isValid = false; }
    else { setConfirmPasswordError(null); }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
            Create Account <UserCheck size={18} style={{ color: 'var(--color-accent-cta)' }} />
          </h3>
          <p className="text-xs" style={{ color: '#666', fontFamily: 'var(--font-body)' }}>
            Join the AI Inbox Operating System.
          </p>
        </div>

        {/* Auth Error */}
        {authError && (
          <div
            className="flex items-center gap-3 p-3.5 text-xs text-left"
            style={{ backgroundColor: '#FFF0F0', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', boxShadow: '3px 3px 0 var(--color-danger)' }}
          >
            <AlertCircle size={14} className="shrink-0" />
            <p className="leading-snug">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#444', fontFamily: 'var(--font-body)' }}>
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3" style={{ color: '#777' }}><Mail size={15} /></span>
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
                <AlertCircle size={10} /><span>{emailError}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#444', fontFamily: 'var(--font-body)' }}>
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3" style={{ color: '#777' }}><Lock size={15} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onKeyDown={handleKeyDown}
                onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(null); }}
                disabled={isLoading}
                style={{ ...inputStyle(!!passwordError), paddingLeft: '36px', paddingRight: '44px' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="absolute right-3 top-3" style={{ color: '#777' }}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-[9px] font-bold" style={{ color: '#666' }}>
                  <span>Strength: {strength.label}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div key={level} className="h-2 flex-1 transition-all duration-300" style={{ backgroundColor: strength.score >= level ? strength.colorBg : '#ddd', border: '1.5px solid var(--color-ink)' }} />
                  ))}
                </div>
              </div>
            )}

            {isCapsLockOn && (
              <p className="text-[9px] flex items-center gap-1.5 mt-1 font-bold pl-1 uppercase" style={{ color: 'var(--color-pending)' }}>
                <AlertCircle size={9} /><span>Warning: Caps Lock is On</span>
              </p>
            )}
            {passwordError && (
              <p className="text-[10px] flex items-center gap-1.5 mt-1 font-bold pl-1" style={{ color: 'var(--color-danger)' }}>
                <AlertCircle size={10} /><span>{passwordError}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#444', fontFamily: 'var(--font-body)' }}>
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3" style={{ color: '#777' }}><Lock size={15} /></span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onKeyDown={handleKeyDown}
                onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPasswordError) setConfirmPasswordError(null); }}
                disabled={isLoading}
                style={{ ...inputStyle(!!confirmPasswordError), paddingLeft: '36px', paddingRight: '44px' }}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1} className="absolute right-3 top-3" style={{ color: '#777' }}>
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-[10px] flex items-center gap-1.5 mt-1 font-bold pl-1" style={{ color: 'var(--color-danger)' }}>
                <AlertCircle size={10} /><span>{confirmPasswordError}</span>
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 min-h-[44px]"
            style={{ backgroundColor: 'var(--color-accent-cta)', border: '1px solid var(--color-ink)', color: '#fff', boxShadow: 'var(--shadow-offset)', fontFamily: 'var(--font-body)' }}
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
            {isLoading ? <><Loader2 size={14} className="animate-spin" /><span>Creating Account...</span></> : <><span>Create Account</span><ArrowRight size={13} /></>}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1" style={{ borderTop: '1px solid var(--color-ink)' }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#888', fontFamily: 'var(--font-body)' }}>or</span>
          <div className="flex-1" style={{ borderTop: '1px solid var(--color-ink)' }} />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={async () => {
            if (!isFirebaseConfigured) {
              setIsLoading(true);
              setTimeout(() => { setIsLoading(false); register('demo@inboxos.dev', 'password123').then(() => navigate('/dashboard')); }, 1000);
              return;
            }
            setIsLoading(true);
            try {
              const result = await signInWithPopup(auth, googleProvider);
              const idToken = await result.user.getIdToken();
              await loginWithFirebase(idToken);
              navigate('/dashboard');
            } catch (err: any) {
              console.error('Google sign-in failed', err);
            } finally {
              setIsLoading(false);
            }
          }}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all min-h-[44px]"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-ink)', color: 'var(--color-ink)', boxShadow: 'var(--shadow-offset)', fontFamily: 'var(--font-body)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset-hover)'; (e.currentTarget as HTMLElement).style.transform = 'translate(3px,3px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <div className="text-center pt-4 text-[10px] font-semibold" style={{ borderTop: '1px solid var(--color-ink)', color: '#666', fontFamily: 'var(--font-body)' }}>
          <p>Join thousands of users running email as an operating system.</p>
          <Link to="/login" onClick={clearError} className="font-bold uppercase tracking-wider mt-1 block transition-colors" style={{ color: 'var(--color-accent-cta)' }}>
            Sign In →
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
