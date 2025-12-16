import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../app/hooks';

export default function PendingApprovalPage() {
  const { logout } = useAuth();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Pending Approval
        </h1>
        
        <p className="text-gray-600 mb-6">
          {user?.firstName 
            ? `Hi ${user.firstName}, your account is currently pending approval from an administrator.`
            : 'Your account has been created and is pending approval from an administrator.'}
          {' '}You will be able to access the driver dashboard once your account has been approved.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            This usually takes 1-2 business days. You will receive a notification
            once your account has been reviewed.
          </p>
        </div>
        
        {user ? (
          <button
            onClick={logout}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
}
