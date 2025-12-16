import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';
import type { User, UserStatus } from '../../types/user.types';

interface Driver extends User {
  createdAt: string;
}

type FilterStatus = 'ALL' | UserStatus;

export default function DriversPage() {
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  // Fetch all drivers with filter
  const { data: drivers, isLoading, error, refetch } = useQuery({
    queryKey: ['drivers', filter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.append('status', filter);
      if (search) params.append('search', search);
      
      const response = await apiClient.get(`/auth/admin/drivers?${params.toString()}`);
      return response.data.data as Driver[];
    },
  });

  // Mutation to update driver status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: UserStatus }) => {
      const response = await apiClient.patch(`/auth/admin/driver/${userId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    updateStatusMutation.mutate({ userId, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions: UserStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
        <p className="text-gray-600">Manage driver accounts and approvals</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search drivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <span>Error loading drivers: {(error as Error).message}</span>
          <button 
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && drivers?.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No drivers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter !== 'ALL' ? `No drivers with status: ${filter}` : 'No drivers registered yet.'}
          </p>
        </div>
      )}

      {/* Drivers Table */}
      {!isLoading && !error && drivers && drivers.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver: Driver) => (
                <tr key={driver._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {driver.firstName?.[0] || ''}{driver.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {driver.firstName} {driver.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Status Dropdown */}
                    <select
                      value={driver.status}
                      onChange={(e) => handleStatusChange(driver._id, e.target.value as UserStatus)}
                      disabled={updateStatusMutation.isPending}
                      className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${getStatusBadge(driver.status)} disabled:opacity-50`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(driver.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      {driver.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(driver._id, 'APPROVED')}
                          disabled={updateStatusMutation.isPending}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {driver.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleStatusChange(driver._id, 'REJECTED')}
                          disabled={updateStatusMutation.isPending}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Summary */}
      {!isLoading && drivers && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-yellow-800 font-semibold text-lg">
              {drivers.filter(d => d.status === 'PENDING').length}
            </div>
            <div className="text-yellow-600 text-sm">Pending Approval</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-green-800 font-semibold text-lg">
              {drivers.filter(d => d.status === 'APPROVED').length}
            </div>
            <div className="text-green-600 text-sm">Approved Drivers</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-red-800 font-semibold text-lg">
              {drivers.filter(d => d.status === 'REJECTED').length}
            </div>
            <div className="text-red-600 text-sm">Rejected</div>
          </div>
        </div>
      )}
    </div>
  );
}
