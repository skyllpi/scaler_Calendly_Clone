import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Plus, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useAdminCreate } from '../context/AdminCreateContext';

const navItems = [
  { href: '/admin/events', label: 'Event Types', icon: Calendar },
  { href: '/admin/availability', label: 'Availability', icon: Clock },
  { href: '/admin/meetings', label: 'Meetings', icon: Users }
];

export default function Sidebar() {
  const router = useRouter();
  const { setOpenCreateModal } = useAdminCreate();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const nextTheme = stored || 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const openCreate = () => {
    setOpenCreateModal(true);
    if (router.pathname !== '/admin/events') {
      router.push('/admin/events');
    }
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 dark:border-[#1a1a1a] dark:bg-black">
      <button
        onClick={openCreate}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#006bff] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
      >
        <Plus size={16} />
        Create
      </button>

      <div className="mt-8 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Cal_Sky
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-[#111111] dark:text-white'
                  : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-[#111111]'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-[#1a1a1a] dark:text-white"
        >
          <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </aside>
  );
}
