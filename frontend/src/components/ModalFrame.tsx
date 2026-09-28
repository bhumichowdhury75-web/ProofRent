import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from './PrismIcons';

interface ModalFrameProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function ModalFrame({ title, onClose, children, wide = false }: ModalFrameProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousActive?.focus?.();
    };
  }, []);

  return (
    <div
      className="pr-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`pr-modal-frame ${wide ? 'pr-modal-frame-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pr-modal-heading">
          <div>
            <div className="pr-modal-kicker">private interface / proofrent</div>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="pr-modal-close" aria-label="Close dialog">
            <X size={17} />
          </button>
        </div>
        <div className="pr-modal-content">{children}</div>
      </div>
    </div>
  );
}
