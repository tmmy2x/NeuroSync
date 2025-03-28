// components/Header.jsx
import { useOrgContext } from '@/hooks/useOrgContext';

export const Header = () => {
  const { orgName, switchOrg } = useOrgContext();

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-100">
      <h1 className="text-lg font-semibold">NeuroSync</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Org: {orgName || 'None'}</span>
        <button onClick={() => switchOrg({ id: 'org_123', name: 'Pulse Collective' })}>
          Switch
        </button>
      </div>
    </header>
  );
};
