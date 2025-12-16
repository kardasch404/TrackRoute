import { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, CheckCircle, Clock, MapPin, Truck } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useDriverStats } from '../../hooks/useDriverTrips';
import Spinner from '../../components/common/Spinner';

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: stats, isLoading: statsLoading } = useDriverStats();

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg mb-2">Failed to load profile</div>
        <p className="text-gray-500">Please try refreshing the page</p>
      </div>
    );
  }

  const statusConfig = {
    PENDING: { label: 'Pending Approval', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
    APPROVED: { label: 'Approved', color: 'text-green-800', bgColor: 'bg-green-100' },
    REJECTED: { label: 'Rejected', color: 'text-red-800', bgColor: 'bg-red-100' },
  };

  const status = statusConfig[profile.status] || statusConfig.PENDING;
  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">View and manage your account information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-blue-600">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-blue-200">{profile.role}</p>
            </div>

            {/* Status Badge */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Account Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            {!statsLoading && stats && (
              <div className="px-6 py-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalTrips}</p>
                    <p className="text-xs text-gray-500">Total Trips</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
                    <p className="text-xs text-gray-500">In Progress</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600">{stats.planned}</p>
                    <p className="text-xs text-gray-500">Planned</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Name */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-medium text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-lg font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-lg font-medium text-gray-900">
                    {profile.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-lg font-medium text-gray-900">{profile.role}</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-lg font-medium text-gray-900">{memberSince}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Account Active</p>
                  <p className="text-lg font-medium text-gray-900">
                    {profile.isActive ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Performance Card */}
          {!statsLoading && stats && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Trip Performance</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Distance</p>
                      <p className="text-xl font-bold text-gray-900">
                        {stats.totalDistance.toLocaleString()} km
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className="text-xl font-bold text-gray-900">
                        {stats.totalTrips > 0 
                          ? Math.round((stats.completed / stats.totalTrips) * 100) 
                          : 0}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Trip</p>
                      <p className="text-xl font-bold text-gray-900">
                        {stats.currentTrip ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Trip Info */}
                {stats.currentTrip && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Current Trip</h4>
                    <div className="flex items-center gap-2 text-blue-800">
                      <MapPin size={16} />
                      <span>{stats.currentTrip.origin}</span>
                      <span>→</span>
                      <span>{stats.currentTrip.destination}</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Distance: {stats.currentTrip.distance} km
                    </p>
                  </div>
                )}

                {/* Next Trip Info */}
                {stats.nextTrip && !stats.currentTrip && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Next Planned Trip</h4>
                    <div className="flex items-center gap-2 text-yellow-800">
                      <MapPin size={16} />
                      <span>{stats.nextTrip.origin}</span>
                      <span>→</span>
                      <span>{stats.nextTrip.destination}</span>
                    </div>
                    <p className="text-sm text-yellow-600 mt-1">
                      Distance: {stats.nextTrip.distance} km
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
