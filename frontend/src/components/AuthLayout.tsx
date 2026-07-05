import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Inbox,
  Cpu,
  Zap,
  Send,
  CheckCircle2,
  Check,
} from 'lucide-react';

interface Testimonial {
  text: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: "I haven't manually organized email in weeks. InboxOS handles it all.",
    author: 'Alex Carter',
    role: 'Startup Founder',
  },
  {
    text: 'InboxOS catches critical deadlines and logs tasks before I even open my mail.',
    author: 'Elena Rostova',
    role: 'CS Student',
  },
  {
    text: 'My inbox finally works like an operating system. Self-hosting with local Ollama is a game changer.',
    author: 'Marcus Vance',
    role: 'DevOps Engineer',
  },
];

const featureChips = [
  'AI Understanding',
  'Smart Routing',
  'Deadline Detection',
  'WhatsApp Alerts',
  'Calendar Automation',
  'Local AI',
  'Privacy First',
];

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(testimonialInterval);
  }, []);

  useEffect(() => {
    const pipelineInterval = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % 5);
    }, 2800);
    return () => clearInterval(pipelineInterval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-x-hidden select-none"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-ink)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ── Left Showcase Panel ─────────────────────────────────────────────────── */}
      <div
        className="w-full lg:w-[60%] flex flex-col justify-between p-8 lg:p-14 z-10 relative border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: 'var(--color-ink)', borderWidth: '0 3px 0 0', borderStyle: 'solid' }}
      >
        {/* Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10"
              style={{ backgroundColor: 'var(--color-ink)', border: '1px solid var(--color-ink)' }}
            >
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h2
                className="text-lg leading-none"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
              >
                InboxOS
              </h2>
              <span
                className="text-[9px] font-bold tracking-widest uppercase block mt-0.5"
                style={{ color: '#666', fontFamily: 'var(--font-body)' }}
              >
                AI Operating System
              </span>
            </div>
          </div>
          <span
            className="text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider"
            style={{ border: '1px solid var(--color-ink)', color: 'var(--color-ink)', boxShadow: '2px 2px 0 var(--color-ink)' }}
          >
            Open Source
          </span>
        </div>

        {/* Hero */}
        <div className="my-12 lg:my-0 space-y-8 max-w-xl text-left">
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight leading-[1.06]"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Your inbox should{' '}
            <span
              className="inline-block px-1"
              style={{
                backgroundColor: 'var(--color-accent)',
                border: '1px solid var(--color-ink)',
                boxShadow: '5px 5px 0 var(--color-ink)',
                lineHeight: '1.15',
              }}
            >
              think before you do.
            </span>
          </h1>

          <p
            className="text-sm leading-relaxed max-w-lg"
            style={{ color: '#555', fontFamily: 'var(--font-body)' }}
          >
            InboxOS parses and understands every incoming email. It automatically
            calculates priorities, isolates tasks, schedules calendar events, and
            escalates critical notifications to Slack or WhatsApp based on your routing logic.
          </p>

          {/* Pipeline Visualization */}
          <div
            className="relative overflow-hidden p-5"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-ink)',
              boxShadow: 'var(--shadow-offset)',
            }}
          >
            <div
              className="flex items-center justify-between pb-3 mb-4 text-[9px] font-bold uppercase tracking-widest"
              style={{ borderBottom: '1px solid var(--color-ink)', color: '#666' }}
            >
              <span>Dynamic Pipeline Agent</span>
              <span style={{ color: 'var(--color-accent-cta)' }}>Active Thread</span>
            </div>

            <div className="grid grid-cols-4 gap-2 relative">
              {[
                { step: 0, icon: <Inbox size={14} />, label: 'Ingest', val: 'Parsing raw header...' },
                { step: 1, icon: <Cpu size={14} />, label: 'AI Analyze', val: 'Priority: 94% Urgent' },
                { step: 2, icon: <Zap size={14} />, label: 'Rules DSL', val: 'Trigger: Outage Rule' },
                { step: 3, icon: <Send size={14} />, label: 'Dispatch', val: 'Dispatched slack payload' },
              ].map((node) => {
                const isActive = pipelineStep === node.step;
                return (
                  <div
                    key={node.step}
                    className="p-2.5 text-center transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--color-ink)' : '#ccc'}`,
                      boxShadow: isActive ? '3px 3px 0 var(--color-ink)' : 'none',
                      transform: isActive ? 'translate(-1px,-1px)' : '',
                    }}
                  >
                    <div
                      className="mx-auto h-7 w-7 flex items-center justify-center mb-1.5 transition-colors"
                      style={{
                        backgroundColor: isActive ? 'var(--color-ink)' : '#f0f0f0',
                        color: isActive ? '#fff' : '#999',
                      }}
                    >
                      {node.icon}
                    </div>
                    <p
                      className="text-[10px] font-bold"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
                    >
                      {node.label}
                    </p>
                    <p className="text-[8px] truncate mt-0.5" style={{ color: '#666', fontFamily: 'var(--font-mono)' }}>
                      {pipelineStep >= node.step ? node.val : 'Idle...'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Pipeline Completed Notification */}
            <AnimatePresence>
              {pipelineStep === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20"
                  style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-ink)' }}
                >
                  <div
                    className="h-8 w-8 flex items-center justify-center mb-2"
                    style={{ backgroundColor: 'var(--color-success)', border: '1px solid var(--color-ink)' }}
                  >
                    <CheckCircle2 size={18} className="text-white" />
                  </div>
                  <h5 className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
                    Email Action Handled
                  </h5>
                  <p className="text-[10px] mt-0.5" style={{ color: '#666', fontFamily: 'var(--font-body)' }}>
                    Thread parsed, rule resolved, notifications dispatched in 0.8s.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feature Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {featureChips.map((chip, idx) => (
              <motion.span
                key={idx}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: idx * 0.4 }}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 flex items-center gap-1 cursor-default transition-all"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-ink)',
                  boxShadow: '2px 2px 0 var(--color-ink)',
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Check size={10} style={{ color: 'var(--color-accent-cta)' }} />
                <span>{chip}</span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Auth Panel ─────────────────────────────────────────────────────── */}
      <div
        className="w-full lg:w-[40%] flex flex-col justify-between p-8 lg:p-14 z-10 relative"
        style={{ backgroundColor: '#FDFBF5' }}
      >
        <div className="hidden lg:block h-6" />

        {/* Auth Form Portal */}
        <div className="w-full max-w-[400px] mx-auto py-8 lg:py-0">
          {children}
        </div>

        {/* Testimonials */}
        <div
          className="w-full max-w-[400px] mx-auto pt-6 mt-8"
          style={{ borderTop: '1px solid var(--color-ink)' }}
        >
          <div className="min-h-[76px] flex flex-col justify-between text-left relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-2.5"
              >
                <div className="flex gap-1" style={{ color: 'var(--color-accent-cta)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} size={10} fill="currentColor" />
                  ))}
                </div>
                <p
                  className="text-xs italic font-medium leading-relaxed"
                  style={{ color: '#555', fontFamily: 'var(--font-body)' }}
                >
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}>
                    {testimonials[activeTestimonial].author}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#888' }}>
                    {testimonials[activeTestimonial].role}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
