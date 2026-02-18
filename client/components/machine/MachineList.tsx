'use client';

import type { MachineBasicInfo } from '@/types/index';

interface MachineListProps {
  machines: MachineBasicInfo[];
  onDelete: (id: string) => void;
  deleting: string | null;
}

export default function MachineList({ machines, onDelete, deleting }: MachineListProps) {
  if (machines.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No machines yet.</p>
        <p className="text-sm mt-1">Add your first machine to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-2 pr-4 font-medium">Name</th>
            <th className="pb-2 pr-4 font-medium">Hostname</th>
            <th className="pb-2 pr-4 font-medium">Port</th>
            <th className="pb-2 pr-4 font-medium">Username</th>
            <th className="pb-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-3 pr-4 font-medium">{machine.name}</td>
              <td className="py-3 pr-4 text-gray-600">{machine.hostname}</td>
              <td className="py-3 pr-4 text-gray-600">{machine.port}</td>
              <td className="py-3 pr-4 text-gray-600">{machine.username}</td>
              <td className="py-3">
                <button
                  onClick={() => onDelete(machine.id)}
                  disabled={deleting === machine.id}
                  className="text-red-500 hover:text-red-700 disabled:opacity-40 text-sm"
                >
                  {deleting === machine.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}