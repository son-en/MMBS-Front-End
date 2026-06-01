import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface BottomSheetModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  detail?: string;
}

export function BottomSheetModal({ open, onClose, title, message, detail }: BottomSheetModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        style={{ backdropFilter: 'blur(2px)' }}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
          animation: 'slideUpSheet 0.25s ease-out forwards',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-gray-200" />
        </div>

        <div className="px-5 pb-2 pt-3">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#DC2626' }}>{title}</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 500 }}>Safety Guardrail Triggered</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Message */}
          <div
            className="px-4 py-3 rounded-xl mb-3"
            style={{ background: '#FFF5F5', border: '1px solid #FECACA' }}
          >
            <p style={{ fontSize: '0.875rem', color: '#991B1B', lineHeight: 1.6 }}>{message}</p>
          </div>

          {detail && (
            <p style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.5 }}>{detail}</p>
          )}

          {/* Action */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-3.5 rounded-xl text-white"
            style={{
              background: '#1E3A8A',
              fontWeight: 700,
              fontSize: '0.9rem',
              minHeight: 52,
            }}
          >
            Understood — Correct Entry
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
