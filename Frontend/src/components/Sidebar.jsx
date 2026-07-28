import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bed, 
  CalendarCheck, 
  Users, 
  Settings,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, role }) => {
  const adminLinks = [
    { title: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { title: 'Rooms', icon: Bed, path: '/admin/rooms' },
    { title: 'Bookings', icon: CalendarCheck, path: '/admin/bookings' },
    { title: 'Users', icon: Users, path: '/admin/users' },
  ];

  const customerLinks = [
    { title: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Browse Rooms', icon: Bed, path: '/rooms' },
    { title: 'My Bookings', icon: CalendarCheck, path: '/bookings' }, // In this app, dashboard/bookings are similar
    { title: 'Profile Settings', icon: Settings, path: '/profile' },
  ];

  const links = role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-[#fdfaf5] transform transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-10 border-b border-slate-50">
           <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Navigation</h2>
        </div>
        <div className="flex-1 py-10 overflow-y-auto">
          <nav className="px-6 space-y-4">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-6 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-[#8b6e3d] text-white shadow-lg scale-105'
                      : 'text-slate-500 hover:bg-[#fdfaf5] hover:text-[#8b6e3d]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center">
                      <link.icon className={`w-5 h-5 mr-4 transition-colors ${isActive ? 'text-white' : 'text-[#8b6e3d]'}`} />
                      {link.title}
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-20'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
