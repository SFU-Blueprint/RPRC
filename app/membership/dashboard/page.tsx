'use client';

import { inter, headerStyles } from '@/app/fonts';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

export default function MembershipDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-6 text-gray-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-12">
        <h1 className={`${headerStyles.lResponsive} text-gray-900 mb-6`}>
          Membership Dashboard
        </h1>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <p className="text-gray-700 mb-4">
            Welcome, {user?.email}!
          </p>
          <p className="text-gray-600">
            Your membership dashboard is currently under construction.
          </p>
        </div>
      </div>
    </div>
  );
}
