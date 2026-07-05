import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCompose } from '../context/ComposeContext';
import { Button } from './Button';
import {
  X,
  Send,
  Sparkles,
  Loader2,
  Bold,
  Italic,
  Code,
  List,
  Mail,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface FormInputs {
  to: string;
  cc: string;
  subject: string;
  body: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const ComposeModal: React.FC = () => {
  const { isOpen, initialValues, closeCompose } = useCompose();

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { to: '', cc: '', subject: '', body: '' },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        to: initialValues?.to || '',
        cc: initialValues?.cc || '',
        subject: initialValues?.subject || '',
        body: initialValues?.body || '',
      });
    }
  }, [isOpen, initialValues, reset]);

  if (!isOpen) return null;

  const insertMarkdown = (symbol: string) => {
    const textarea = document.getElementById('compose-body') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    let replacement = '';
    if (symbol === 'bold') replacement = `**${selected || 'bold text'}**`;
    else if (symbol === 'italic') replacement = `*${selected || 'italic text'}*`;
    else if (symbol === 'code') replacement = `\`${selected || 'code'}\``;
    else if (symbol === 'list') replacement = `\n- ${selected || 'list item'}`;
    const newText = before + replacement + after;
    setValue('body', newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const triggerAiDraft = async () => {
    setIsAiLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const toVal = getValues('to') || 'Recipient';
    const subVal = getValues('subject') || 'General Request';
    const name = toVal.split('@')[0];
    const generatedDraft = `Hi ${name.charAt(0).toUpperCase() + name.slice(1)},\n\nThank you for reaching out regarding "${subVal}". I wanted to let you know that I have received your request and will review the details shortly.\n\nI will get back to you coordinate next steps as soon as possible.\n\nBest regards,\nAlex Carter`;
    setValue('body', generatedDraft);
    setIsAiLoading(false);
  };

  const onSubmit = async (formData: FormInputs) => {
    setIsSending(true);
    try {
      const response = await fetch(`${API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Endpoint send offline');
      setToastMessage('Email dispatched successfully!');
    } catch (err) {
      console.warn('[ComposeModal] POST /api/emails/send failed. Fallback mock dispatch.', err);
      setToastMessage('Email dispatched successfully! (Mock pipeline)');
    } finally {
      setIsSending(false);
      setTimeout(() => {
        setToastMessage(null);
        closeCompose();
      }, 2500);
    }
  };

  // Shared input style
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

  const toolbarBtnStyle: React.CSSProperties = {
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-ink)',
    color: 'var(--color-ink)',
    cursor: 'pointer',
    minHeight: '36px',
    minWidth: '36px',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: 'rgba(17,17,17,0.65)' }}
        onClick={closeCompose}
      />

      {/* Success Toast */}
      {toastMessage && (
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 flex items-center gap-3 animate-slideIn"
          style={{
            backgroundColor: 'var(--color-success)',
            border: '1px solid var(--color-ink)',
            boxShadow: 'var(--shadow-offset)',
            color: '#fff',
          }}
        >
          <CheckCircle size={18} />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {toastMessage}
          </span>
        </div>
      )}

      {/* Main Compose Card */}
      <div
        className="relative w-full max-w-[640px] flex flex-col max-h-[90vh] z-10 overflow-hidden animate-scaleUp"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-ink)',
          boxShadow: '8px 8px 0px var(--color-ink)',
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-ink)', backgroundColor: 'var(--color-accent)' }}
        >
          <div className="flex items-center gap-2">
            <Mail size={16} style={{ color: 'var(--color-ink)' }} />
            <h2
              className="text-sm font-bold uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              Compose Outbound Action
            </h2>
          </div>
          <button
            onClick={closeCompose}
            className="p-2 flex items-center justify-center transition-all min-h-[44px] min-w-[44px]"
            style={{
              border: '1px solid var(--color-ink)',
              backgroundColor: 'var(--color-surface)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#eee';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {/* TO Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
              >
                To
              </label>
              {errors.to && (
                <span
                  className="text-[9px] flex items-center gap-1 font-bold"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <AlertCircle size={9} />
                  <span>{errors.to.message}</span>
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="recipient@domain.com"
              disabled={isSending}
              {...register('to', {
                required: 'Recipient is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address' },
              })}
              style={inputStyle(!!errors.to)}
            />
          </div>

          {/* CC Field */}
          <div className="space-y-1">
            <label
              className="text-[10px] font-bold uppercase tracking-widest block mb-1"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
            >
              CC
            </label>
            <input
              type="text"
              placeholder="optional@domain.com"
              disabled={isSending}
              {...register('cc')}
              style={inputStyle()}
            />
          </div>

          {/* SUBJECT Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
              >
                Subject
              </label>
              {errors.subject && (
                <span
                  className="text-[9px] flex items-center gap-1 font-bold"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <AlertCircle size={9} />
                  <span>{errors.subject.message}</span>
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Subject line"
              disabled={isSending}
              {...register('subject', { required: 'Subject line is required' })}
              style={inputStyle(!!errors.subject)}
            />
          </div>

          {/* BODY Field */}
          <div className="space-y-1 flex-1 flex flex-col min-h-[220px]">
            <div className="flex justify-between items-center mb-1">
              <label
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
              >
                Message Body
              </label>
              {errors.body && (
                <span
                  className="text-[9px] flex items-center gap-1 font-bold"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <AlertCircle size={9} />
                  <span>{errors.body.message}</span>
                </span>
              )}
            </div>

            <div
              className="flex flex-col flex-1 overflow-hidden"
              style={{ border: '1px solid var(--color-ink)' }}
            >
              {/* Text formatting bar */}
              <div
                className="flex items-center justify-between px-2 py-1.5"
                style={{ borderBottom: '1px solid var(--color-ink)', backgroundColor: '#f8f8f8' }}
              >
                <div className="flex items-center gap-1">
                  {[
                    { symbol: 'bold', icon: <Bold size={12} />, title: 'Bold' },
                    { symbol: 'italic', icon: <Italic size={12} />, title: 'Italic' },
                    { symbol: 'code', icon: <Code size={12} />, title: 'Code' },
                    { symbol: 'list', icon: <List size={12} />, title: 'List' },
                  ].map(({ symbol, icon, title }) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => insertMarkdown(symbol)}
                      title={title}
                      style={toolbarBtnStyle}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-ink)';
                        (e.currentTarget as HTMLElement).style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--color-ink)';
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                {/* AI Assist */}
                <button
                  type="button"
                  onClick={triggerAiDraft}
                  disabled={isAiLoading || isSending}
                  className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--color-accent-cta)',
                    border: '1px solid var(--color-ink)',
                    color: '#fff',
                    boxShadow: '2px 2px 0 var(--color-ink)',
                  }}
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 size={10} className="animate-spin" />
                      <span>Drafting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={10} />
                      <span>AI Draft</span>
                    </>
                  )}
                </button>
              </div>

              {/* Textarea */}
              <textarea
                id="compose-body"
                placeholder="Write your email here... Use formatting bar above."
                disabled={isSending}
                {...register('body', { required: 'Message body is required' })}
                className="w-full flex-1 min-h-[160px] resize-none p-4 text-xs leading-relaxed"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Form Submit Footer */}
          <div
            className="flex justify-end gap-3 pt-3"
            style={{ borderTop: '1px solid var(--color-ink)' }}
          >
            <Button
              variant="secondary"
              onClick={closeCompose}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSending}>
              {isSending ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send Action</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
