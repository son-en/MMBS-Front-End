import type { MilkStatus } from '../types';

const statusConfig: Record<MilkStatus, { bg: string; text: string; border: string; label: string }> = {
  raw: { bg: '#FFF0F7', text: '#9D174D', border: '#FBCFE8', label: 'Raw Stock' },
  quarantined: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: 'Quarantined' },
  pasteurized: { bg: '#ECFEFF', text: '#0E7490', border: '#A5F3FC', label: 'Ready — Pasteurized' },
  rejected: { bg: '#FFF5F5', text: '#991B1B', border: '#FECACA', label: 'Rejected / Alert' },
};

interface StatusBadgeProps {
  status: MilkStatus;
  small?: boolean;
}

export function StatusBadge({ status, small }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center rounded-full border"
      style={{
        background: cfg.bg,
        color: cfg.text,
        borderColor: cfg.border,
        padding: small ? '2px 8px' : '3px 10px',
        fontSize: small ? '0.7rem' : '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        className="inline-block rounded-full mr-1.5"
        style={{ width: small ? 5 : 6, height: small ? 5 : 6, background: cfg.text, flexShrink: 0 }}
      />
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: 1 | 2 | 3 }) {
  const cfg = {
    1: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'Priority 1: Critical NICU Preemie' },
    2: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: 'Priority 2: High Medical Need' },
    3: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Priority 3: Standard Need' },
  }[priority];
  return (
    <span
      className="inline-flex items-center rounded-full border"
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}
    >
      {cfg.label}
    </span>
  );
}

export function DeliveryStatusBadge({ status }: { status: 'sent' | 'delivered' | 'failed' }) {
  const cfg = {
    sent: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', label: 'Sent' },
    delivered: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Delivered' },
    failed: { bg: '#FFF5F5', text: '#991B1B', border: '#FECACA', label: 'Failed — Retry Required' },
  }[status];
  return (
    <span
      className="inline-flex items-center rounded-full border"
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}
    >
      {cfg.label}
    </span>
  );
}
