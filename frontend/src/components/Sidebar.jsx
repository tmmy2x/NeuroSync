// components/Sidebar.jsx
import { useOrgContext } from '@/hooks/useOrgContext';

export const Sidebar = () => {
  const { orgName } = useOrgContext();

  return (
    <aside className="w-64 p-4 bg-white border-r">
      <div className="text-sm text-gray-500 mb-2">Org: {orgName || 'Not set'}</div>
      {/* other nav links */}
    </aside>
  );
};
