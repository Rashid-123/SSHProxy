'use client';

import type {MachineBasicInfo } from '@/types/index';

interface MachineDetailCardProps {
  machine: MachineBasicInfo;
}

export default function MachineDetailCard({ machine }: MachineDetailCardProps) {
  const fields: { label: string; value: string }[] = [
    { label: 'Hostname', value: machine.hostname },
    { label: 'Port', value: String(machine.port) },
    { label: 'Username', value: machine.username },
    { label: 'Created', value: new Date(machine.createdAt).toLocaleString() },
    { label: 'Last Updated', value: new Date(machine.updatedAt).toLocaleString() },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
      {fields.map(({ label, value }) => (
        <div key={label} className="flex items-start px-6 py-4">
          <span className="w-36 shrink-0 text-sm font-medium text-gray-500">{label}</span>
          <span className="text-sm text-gray-900 font-mono break-all">{value}</span>
        </div>
      ))}
    </div>
  );
}