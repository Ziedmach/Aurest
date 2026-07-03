"use client";

import { AlertTriangle, X } from "lucide-react";

export function UiModal({ title, subtitle, children, onClose, size = "medium" }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void; size?: "small" | "medium" | "large" }) {
  return <div className="ui-modal-layer" role="dialog" aria-modal="true" aria-label={title}>
    <button className="ui-modal-backdrop" onClick={onClose} aria-label="Close dialog" />
    <section className={`ui-modal-card ${size}`}>
      <header><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button type="button" onClick={onClose} aria-label="Close"><X size={19} /></button></header>
      <div className="ui-modal-content">{children}</div>
    </section>
  </div>;
}

export function FormActions({ onCancel, submitLabel = "Save changes", danger = false }: { onCancel: () => void; submitLabel?: string; danger?: boolean }) {
  return <div className="form-actions"><button type="button" className="ghost-button" onClick={onCancel}>Cancel</button><button type="submit" className={danger ? "danger-button" : "primary-button"}>{submitLabel}</button></div>;
}

export function ConfirmModal({ title, message, confirmLabel = "Delete", onCancel, onConfirm }: { title: string; message: string; confirmLabel?: string; onCancel: () => void; onConfirm: () => void }) {
  return <UiModal title={title} onClose={onCancel} size="small"><div className="confirm-content"><i><AlertTriangle size={22} /></i><p>{message}</p></div><div className="form-actions"><button className="ghost-button" onClick={onCancel}>Cancel</button><button className="danger-button" onClick={onConfirm}>{confirmLabel}</button></div></UiModal>;
}
