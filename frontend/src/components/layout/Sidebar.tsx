import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Container, MapPin, Users, Wrench, FileText } from 'lucide-react';

interface SidebarProps {
  role: 'ADMIN' | 'DRIVER';
}

export default function Sidebar({ role }: SidebarProps) {
  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/trucks', icon: Truck, label: 'Trucks' },
    { to: '/admin/trailers', icon: Container, label: 'Trailers' },
    { to: '/admin/trips', icon: MapPin, label: 'Trips' },
    { to: '/admin/drivers', icon: Users, label: 'Drivers' },
    { to: '/admin/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
  ];

  const driverLinks = [
    { to: '/driver/my-trips', icon: MapPin, label: 'My Trips' },
  ];

  const links = role === 'ADMIN' ? adminLinks : driverLinks;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`
            }
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
