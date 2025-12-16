import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../app/hooks';

export default function AccountRejectedPage() {
  const { logout } = useAuth();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Rejected
        </h1>
        
        <p className="text-gray-600 mb-6">
          Hi {user?.firstName}, unfortunately your account registration has been rejected by an administrator.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            If you believe this is an error, please contact support for more information.
          </p>
        </div>
        
        <button
          onClick={logout}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
