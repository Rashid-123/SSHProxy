'use client';

import { useState } from 'react';
import type { CreateMachineRequest } from '@/types/index';
import { Info } from 'lucide-react';

interface AddMachineModalProps {
  onClose: () => void;
  onSubmit: (data: CreateMachineRequest) => Promise<void>;
}

const defaultForm: CreateMachineRequest = {
  name: '',
  hostname: '',
  port: 22,
  username: '',
  privateKey: '',
  passphrase: '',
  password: '',
};

export default function AddMachineModal({ onClose, onSubmit }: AddMachineModalProps) {
  const [form, setForm] = useState<CreateMachineRequest>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'port' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create machine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-card border border-slate-border rounded-sm w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-border">
          <h2 className="text-lg font-semibold text-slate-text">Add Machine</h2>
          <button
            onClick={onClose}
            className="text-slate-muted hover:text-slate-text text-xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-5 p-3 border border-brand-danger text-brand-danger rounded-sm text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              hint="A friendly label to identify this machine (e.g. prod-server, home-pi)."
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <Field
                  label="Hostname"
                  name="hostname"
                  value={form.hostname}
                  onChange={handleChange}
                  required
                  placeholder="192.168.1.1 or example.com"
                  hint="The IP address or domain name of your remote machine."
                />
              </div>
              <div className="w-24">
                <Field
                  label="Port"
                  name="port"
                  type="number"
                  value={String(form.port)}
                  onChange={handleChange}
                  hint="Default SSH port is 22."
                />
              </div>
            </div>

            <Field
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="root, ubuntu, ec2-user..."
              hint="The SSH user on the remote machine."
            />

            {/* Password with prominent hint */}
            <div>
              <Field
                label="Encryption Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <div className="mt-2 flex items-start gap-2 p-3 bg-slate-page border border-slate-border rounded-sm">
                <Info size={13} className="text-slate-muted mt-0.5 flex-shrink-0" />
                <p className="text-slate-muted text-xs leading-relaxed">
                  This password is <span className="text-slate-text font-medium">not</span> your system or SSH password. It is used to encrypt your private key using AES-256-GCM before storing it. You will need to enter it every time you open a terminal session. <span className="text-slate-text font-medium">It cannot be recovered if lost.</span>
                </p>
              </div>
            </div>

            {/* Private Key */}
            <div>
              <label className="block text-sm font-medium text-slate-muted mb-1">
                Private Key <span className="text-brand-danger">*</span>
              </label>
              <textarea
                name="privateKey"
                value={form.privateKey}
                onChange={handleChange}
                required
                rows={4}
                placeholder="-----BEGIN RSA PRIVATE KEY-----"
                className="w-full border border-slate-border bg-slate-page text-slate-text rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-slate-muted"
              />
              <p className="text-slate-muted text-xs mt-1.5">
                Your PEM-formatted private key. It will be encrypted with your password above before being stored — it is never saved in plain text.
              </p>
            </div>

            {/* Passphrase */}
            <div>
              <Field
                label="Passphrase (optional)"
                name="passphrase"
                type="password"
                value={form.passphrase || ''}
                onChange={handleChange}
                hint="Only required if your private key was generated with a passphrase."
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-border mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-slate-border text-slate-muted hover:text-slate-text hover:border-slate-muted rounded-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-brand-primary hover:bg-brand-primaryHover text-slate-text rounded-sm disabled:opacity-50 transition-colors"
              >
                {loading ? 'Adding...' : 'Add Machine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}

function Field({ label, name, value, onChange, type = 'text', required, placeholder, hint }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-muted mb-1">
        {label} {required && <span className="text-brand-danger">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-slate-border bg-slate-page text-slate-text rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-slate-muted"
      />
      {hint && (
        <p className="text-slate-muted text-xs mt-1.5">{hint}</p>
      )}
    </div>
  );
}