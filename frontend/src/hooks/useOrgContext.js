// hooks/useOrgContext.js

import { createContext, useContext, useState, useEffect } from 'react';

const OrgContext = createContext();

export const OrgProvider = ({ children }) => {
  const [orgId, setOrgId] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const [orgSettings, setOrgSettings] = useState({});

  useEffect(() => {
    // Load last selected org from localStorage on init
    const storedOrgId = localStorage.getItem('ns-org-id');
    const storedOrgName = localStorage.getItem('ns-org-name');
    if (storedOrgId) setOrgId(storedOrgId);
    if (storedOrgName) setOrgName(storedOrgName);
  }, []);

  const switchOrg = ({ id, name, settings }) => {
    setOrgId(id);
    setOrgName(name);
    setOrgSettings(settings || {});

    localStorage.setItem('ns-org-id', id);
    localStorage.setItem('ns-org-name', name);
  };

  return (
    <OrgContext.Provider value={{ orgId, orgName, orgSettings, switchOrg }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrgContext = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrgContext must be used within an OrgProvider');
  }
  return context;
};
