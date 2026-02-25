
'use client';

import type { MachineBasicInfo } from '@/types/index';
import { Network, Hash, User, Calendar, Clock } from 'lucide-react';

interface MachineDetailCardProps {
  machine: MachineBasicInfo;
}

const icons: Record<string, React.ReactNode> = {
  Hostname: <Network size={14} />,
  Port: <Hash size={14} />,
  Username: <User size={14} />,
  Created: <Calendar size={14} />,
  'Last Updated': <Clock size={14} />,
};

export default function MachineDetailCard({ machine }: MachineDetailCardProps) {
  const fields: { label: string; value: string }[] = [
    { label: 'Hostname', value: machine.hostname },
    { label: 'Port', value: String(machine.port) },
    { label: 'Username', value: machine.username },
    { label: 'Created', value: new Date(machine.createdAt).toLocaleString() },
    { label: 'Last Updated', value: new Date(machine.updatedAt).toLocaleString() },
  ];

  return (
    <div className="border border-slate-border rounded-sm bg-slate-card divide-y divide-slate-border">
      {fields.map(({ label, value }) => (
        <div key={label} className="flex items-center px-6 py-4 gap-4">
          <div className="w-36 shrink-0 flex items-center gap-2 text-slate-muted">
            {icons[label]}
            <span className="text-sm">{label}</span>
          </div>
          <span className="text-sm text-slate-text font-mono break-all">{value}</span>
        </div>
      ))}
    </div>
  );
}