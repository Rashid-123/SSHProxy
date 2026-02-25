'use client';

import type { MachineBasicInfo } from '@/types/index';
import { useRouter } from 'next/navigation';
import { Monitor, Trash2, User, Network, Circle } from 'lucide-react';

interface MachineListProps {
  machines: MachineBasicInfo[];
  onDelete: (id: string) => void;
  deleting: string | null;
}

export default function MachineList({ machines, onDelete, deleting }: MachineListProps) {
  const router = useRouter();

  if (machines.length === 0) {
    return (
      <div className="text-center py-20 border border-slate-border rounded-sm">
        <Monitor className="mx-auto mb-4 text-slate-muted" size={40} strokeWidth={1.5} />
        <p className="text-slate-text text-base font-medium">No machines yet.</p>
        <p className="text-slate-muted text-sm mt-1">Add your first machine to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {machines.map((machine) => (
        <div
          key={machine.id}
          onClick={() => router.push(`/machine/${machine.id}`)}
          className="border border-slate-border bg-slate-card rounded-sm cursor-pointer hover:border-slate-muted transition-all group"
        >
          {/* Top section */}
          <div className="p-6 pb-4">

            {/* Icon + status row */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-sm bg-slate-page border border-slate-border flex items-center justify-center">
                <Monitor className="text-slate-muted group-hover:text-slate-text transition-colors" size={22} strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-1.5">
                <Circle className="text-brand-primary fill-brand-primary" size={8} />
                <span className="text-xs text-slate-muted">Ready</span>
              </div>
            </div>

            {/* Machine name */}
            <h3 className="text-slate-text font-bold text-xl mb-1 group-hover:text-white transition-colors truncate">
              {machine.name}
            </h3>

            {/* Hostname */}
            <div className="flex items-center gap-1.5">
              <Network size={13} className="text-slate-muted flex-shrink-0" />
              <p className="text-slate-muted font-mono text-sm truncate">
                {machine.hostname}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-border" />

          {/* Bottom meta row */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-slate-muted text-xs mb-0.5">Port</p>
                <p className="text-slate-text text-sm font-mono">{machine.port}</p>
              </div>
              <div className="w-px h-6 bg-slate-border" />
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-slate-muted" />
                <div>
                  <p className="text-slate-muted text-xs mb-0.5">User</p>
                  <p className="text-slate-text text-sm font-mono truncate max-w-[120px]">{machine.username}</p>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(machine.id);
              }}
              disabled={deleting === machine.id}
              className="flex items-center gap-1.5 text-xs text-slate-muted hover:text-brand-danger disabled:opacity-50 transition-colors"
            >
              <Trash2 size={13} />
              {deleting === machine.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}