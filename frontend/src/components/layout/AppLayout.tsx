import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <TopBar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
