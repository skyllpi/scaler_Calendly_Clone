import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 dark:bg-black dark:text-white">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-10 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
