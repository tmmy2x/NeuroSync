// pages/_app.js or app/layout.jsx (Next.js 13+)
import { OrgProvider } from '@/hooks/useOrgContext';

export default function App({ Component, pageProps }) {
  return (
    <OrgProvider>
      <Component {...pageProps} />
    </OrgProvider>
  );
}
