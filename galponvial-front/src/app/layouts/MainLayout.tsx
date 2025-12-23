import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};
