import SideNav from '@/app/ui/dashboard/sidenav';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Drink Trail Dashboard',
    default: 'Drink Trail Dashboard',
  },
  description: 'The official on-the-go drinking app',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}