import { useState, useEffect, useCallback } from 'react';
import { Clock, Bell, BellOff, CheckCircle2, ChevronDown, AlertTriangle, Calendar, Zap } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ReminderEmail {
  subject: string;
  sender: string;
}

interface Reminder {
  id: string;
  emailId: string;
  deadline: string; // ISO UTC string
  status: 'PENDING' | 'SNOOZED' | 'CANCELLED' | 'FIRED';
  snoozeUntil: string | null;
  createdAt: string;
  email: ReminderEmail;
}

type TimeRemaining = {
  label: string;
  isOverdue: boolean;
  urgency: 'overdue' | 'critical' | 'warning' | 'safe';
  ms: number;
};

function getTimeRemaining(deadlineISO: string): TimeRemaining {
  const now = Date.now();
  const deadlineMs = new Date(deadlineISO).getTime();
  const diff = deadlineMs - now;

  if (diff <= 0) {
    return { label: 'Overdue', isOverdue: true, urgency: 'overdue', ms: diff };
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let label = '';
  if (days > 0) label = `${days}d ${hours % 24}h`;
  else if (hours > 0) label = `${hours}h ${minutes % 60}m`;
  else label = `${minutes}m`;

  const urgency: TimeRemaining['urgency'] =
    diff < 60 * 60 * 1000 ? 'critical' :
    diff < 24 * 60 * 60 * 1000 ? 'warning' :
    'safe';

  return { label, isOverdue: false, urgency, ms: diff };
}

const SNOOZE_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '1 hour', value: 60 },
  { label: '4 hours', value: 240 },
  { label: '1 day', value: 1440 },
];

const urgencyConfig = {
  overdue:  { bg: '#FFF0F0', border: 'var(--color-danger)', dot: 'var(--color-danger)', text: 'var(--color-danger)', badge: { bg: 'var(--color-danger)', color: '#fff' } },
  critical: { bg: '#FFF7E6', border: 'var(--color-pending)', dot: 'var(--color-pending)', text: 'var(--color-pending)', badge: { bg: 'var(--color-pending)', color: '#fff' } },
  warning:  { bg: '#FFFCDC', border: '#B8860B', dot: '#B8860B', text: '#7A6000', badge: { bg: 'var(--color-accent)', color: 'var(--color-ink)' } },
  safe:     { bg: '#F0FFF5', border: 'var(--color-success)', dot: 'var(--color-success)', text: 'var(--color-success)', badge: { bg: 'var(--color-success)', color: '#fff' } },
};

interface ReminderCardProps {
  reminder: Reminder;
  onSnooze: (id: string, minutes: number) => Promise<void>;
  onDone: (emailId: string, reminderId: string) => Promise<void>;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onSnooze, onDone }) => {
  const [showSnooze, setShowSnooze] = useState(false);
  const [snoozingId, setSnoozingId] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => getTimeRemaining(reminder.deadline));

  // Live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(reminder.deadline));
    }, 30000);
    return () => clearInterval(interval);
  }, [reminder.deadline]);

  const cfg = urgencyConfig[timeLeft.urgency];

  const handleSnooze = async (minutes: number) => {
    setSnoozingId(minutes);
    try {
      await onSnooze(reminder.id, minutes);
    } finally {
      setSnoozingId(null);
      setShowSnooze(false);
    }
  };

  const handleDone = async () => {
    setIsDone(true);
    await onDone(reminder.emailId, reminder.id);
  };

  if (isDone) return null;

  const deadlineDate = new Date(reminder.deadline);
  const formattedDeadline = deadlineDate.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="relative p-3 transition-all duration-200 group"
      id={`reminder-card-${reminder.id}`}
      style={{
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: `3px 3px 0 ${cfg.border}`,
      }}
    >
      {/* Urgency pulse for overdue / critical */}
      {(timeLeft.urgency === 'overdue' || timeLeft.urgency === 'critical') && (
        <span
          className="absolute top-2.5 right-2.5 h-2 w-2 animate-ping"
          style={{ backgroundColor: cfg.dot }}
        />
      )}

      <div className="flex items-start gap-2.5">
        {/* Status dot */}
        <div
          className={`mt-1.5 h-2 w-2 shrink-0 ${timeLeft.isOverdue ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: cfg.dot }}
        />

        <div className="flex-1 min-w-0">
          {/* Subject */}
          <p className="text-xs font-bold leading-snug line-clamp-1 mb-1"
            style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}
          >
            {reminder.email.subject}
          </p>

          {/* Sender + Deadline */}
          <div className="flex items-center gap-1.5 text-[10px] mb-2" style={{ color: '#666', fontFamily: 'var(--font-mono)' }}>
            <span className="truncate">{reminder.email.sender}</span>
            <span style={{ color: '#ccc' }}>·</span>
            <Calendar size={9} className="shrink-0" />
            <span className="shrink-0">{formattedDeadline}</span>
          </div>

          {/* Status + countdown */}
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-bold px-2 py-0.5"
              style={{ backgroundColor: cfg.badge.bg, border: `1.5px solid var(--color-ink)`, color: cfg.badge.color, fontFamily: 'var(--font-body)' }}
            >
              {timeLeft.isOverdue ? '⚠ OVERDUE' : `⏱ ${timeLeft.label} left`}
            </span>

            {reminder.status === 'SNOOZED' && (
              <span className="text-[9px] flex items-center gap-1" style={{ color: '#888' }}>
                <BellOff size={9} />
                Snoozed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons — appear on hover */}
      <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Snooze button */}
        <div className="relative flex-1">
          <button
            id={`snooze-btn-${reminder.id}`}
            onClick={() => setShowSnooze(!showSnooze)}
            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-ink)', boxShadow: '2px 2px 0 var(--color-ink)', color: 'var(--color-ink)' }}
          >
            <Bell size={10} />
            Snooze
            <ChevronDown size={9} className={`transition-transform ${showSnooze ? 'rotate-180' : ''}`} />
          </button>

          {showSnooze && (
            <div
              className="absolute bottom-full mb-1.5 left-0 right-0 z-50 overflow-hidden"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-ink)', boxShadow: '4px 4px 0 var(--color-ink)' }}
            >
              {SNOOZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  id={`snooze-opt-${reminder.id}-${opt.value}`}
                  onClick={() => handleSnooze(opt.value)}
                  disabled={snoozingId === opt.value}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase transition-all disabled:opacity-50 hover:bg-yellow-50"
                  style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)', borderBottom: '1px solid var(--color-ink)' }}
                >
                  <Zap size={9} style={{ color: 'var(--color-pending)' }} />
                  {snoozingId === opt.value ? 'Snoozing…' : opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mark Done */}
        <button
          id={`done-btn-${reminder.id}`}
          onClick={handleDone}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all"
          style={{ backgroundColor: 'var(--color-success)', border: '1px solid var(--color-ink)', boxShadow: '2px 2px 0 var(--color-ink)', color: '#fff', fontFamily: 'var(--font-body)' }}
        >
          <CheckCircle2 size={10} />
          Done
        </button>
      </div>
    </div>
  );
};

// ─── Main Widget ───────────────────────────────────────────────────────────────

export const DeadlinesWidget: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchReminders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reminders/upcoming`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReminders(data.reminders || []);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err: any) {
      setError('Could not load reminders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling every 60s
  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 60_000);
    return () => clearInterval(interval);
  }, [fetchReminders]);

  const handleSnooze = async (reminderId: string, durationMinutes: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/reminders/${reminderId}/snooze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ durationMinutes }),
      });
      if (!res.ok) throw new Error('Snooze failed');
      // Update local state
      setReminders((prev) =>
        prev.map((r) =>
          r.id === reminderId ? { ...r, status: 'SNOOZED' } : r
        )
      );
    } catch (err) {
      console.error('[DeadlinesWidget] Snooze error:', err);
    }
  };

  const handleDone = async (_emailId: string, reminderId: string) => {
    // Find action item is hard without ID here — cancel reminders directly
    try {
      await fetch(`${API_BASE}/api/reminders/${reminderId}/cancel`, {
        method: 'POST',
        credentials: 'include',
      });
      setReminders((prev) => prev.filter((r) => r.id !== reminderId));
    } catch (err) {
      console.error('[DeadlinesWidget] Done error:', err);
    }
  };

  const overdueCount = reminders.filter(
    (r) => new Date(r.deadline).getTime() < Date.now()
  ).length;

  return (
    <div className="space-y-3" id="deadlines-widget">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
          <Clock size={15} style={{ color: 'var(--color-accent-cta)' }} />
          <span>Upcoming Deadlines</span>
          {overdueCount > 0 && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 animate-pulse"
              style={{ backgroundColor: 'var(--color-danger)', border: '1.5px solid var(--color-ink)', color: '#fff', fontFamily: 'var(--font-body)' }}
            >
              {overdueCount} overdue
            </span>
          )}
        </h3>
        <button
          id="refresh-deadlines-btn"
          onClick={fetchReminders}
          className="text-[9px] font-bold uppercase tracking-wider transition-colors"
          style={{ color: '#888' }}
          title="Refresh"
        >
          ↻ refresh
        </button>
      </div>

      {/* Content */}
      <div
        className="overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-ink)', boxShadow: 'var(--shadow-offset)' }}
      >
        {loading && (
          <div className="space-y-2.5 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse" style={{ backgroundColor: '#e8e5d8', border: '1px solid #ccc' }} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-2">
            <AlertTriangle size={20} style={{ color: 'var(--color-pending)' }} />
            <p className="text-xs" style={{ color: '#666' }}>{error}</p>
            <button
              onClick={fetchReminders}
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: 'var(--color-accent-cta)' }}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && reminders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-2">
            <div
              className="h-10 w-10 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-success)', border: '1px solid var(--color-ink)' }}
            >
              <CheckCircle2 size={18} className="text-white" />
            </div>
            <p className="text-xs font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}>No upcoming deadlines</p>
            <p className="text-[10px]" style={{ color: '#666' }}>
              Deadlines are automatically extracted from emails
            </p>
          </div>
        )}

        {!loading && !error && reminders.length > 0 && (
          <div className="p-3 space-y-2.5 max-h-[420px] overflow-y-auto">
            {reminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onSnooze={handleSnooze}
                onDone={handleDone}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && reminders.length > 0 && (
          <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] text-gray-600">
              Updated {lastRefreshed.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[9px] text-gray-600">
              {reminders.length} reminder{reminders.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
