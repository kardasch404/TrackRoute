import { LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">TrackRoute</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
