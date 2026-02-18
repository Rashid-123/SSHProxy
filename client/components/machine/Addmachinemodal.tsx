'use client';

import { useState } from 'react';
import type { CreateMachineRequest } from '@/types/index';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Machine</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Hostname" name="hostname" value={form.hostname} onChange={handleChange} required />
            </div>
            <div className="w-24">
              <Field label="Port" name="port" type="number" value={String(form.port)} onChange={handleChange} />
            </div>
          </div>
          <Field label="Username" name="username" value={form.username} onChange={handleChange} required />
          <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Private Key <span className="text-red-500">*</span></label>
            <textarea
              name="privateKey"
              value={form.privateKey}
              onChange={handleChange}
              required
              rows={4}
              placeholder="-----BEGIN RSA PRIVATE KEY-----"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Field label="Passphrase (optional)" name="passphrase" type="password" value={form.passphrase || ''} onChange={handleChange} />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Machine'}
            </button>
          </div>
        </form>
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
}

function Field({ label, name, value, onChange, type = 'text', required, placeholder }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}