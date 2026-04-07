'use client';

import { useEffect, useState } from 'react';
import { inter, robotoCondensed, headerStyles, subheaderStyles, bodyStyles, buttonStyles } from '@/app/fonts';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { Info, Mail, MapPin, Phone, User } from 'lucide-react';
import "@/app/globals.css";
import MembershipStatusCard from '@/components/membership/MembershipStatusCard';
import MembershipProfileBanner from '@/components/membership/MembershipProfileBanner';
import { ApplicationStatus } from '@/lib/constants/enums';
import { fetchMemberDashboardData } from '@/app/actions/dashboard';
import type { MemberDashboardData } from '@/types/membership.types';

export default function MembershipDashboard() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<MemberDashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchMemberDashboardData(user.id)
      .then(data => {
        setDashboardData(data);
      })
      .finally(() => setDataLoading(false));

  }, [user?.id]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-6 text-gray-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <MembershipProfileBanner name={dashboardData?.name ?? ''} role={dashboardData?.type ?? null} />
      <div className='flex flex-col md:flex-row justify-center gap-8 md:gap-6 lg:gap-16 xl:gap-24 mt-8 md:mt-10 px-4 md:px-6 lg:px-12 xl:px-20 pb-16'>
        <div className='flex flex-col gap-8 md:gap-6 lg:gap-10 w-full md:w-auto md:shrink-0'>
          {dashboardData?.status && (
            <MembershipStatusCard status={dashboardData.status as ApplicationStatus} dateFinalized={dashboardData?.dateFinalized ?? ''} />
          )}
          <div className='bg-feedback-info px-4 md:px-4 lg:px-5 py-6 md:py-6 lg:py-8 border rounded-sm border-l-10 border-l-feedback-info-accent w-full md:max-w-xs lg:max-w-md'>
            <div className={`flex gap-2 items-center mb-3`}>
              <Info className="text-application-detail-blue-500" />
              <h2 className={`${headerStyles.xs} font-medium`}>Need Help?</h2>
            </div>
            <p className={`${bodyStyles.m}`}>For assistance, email - <a href="mailto:info@richmondprc.org" className="underline hover:opacity-75">info@richmondprc.org</a></p>
          </div>
        </div>
        <div className='flex flex-col w-full md:max-w-sm lg:max-w-xl xl:max-w-2xl'>
          <a className={`${buttonStyles.text} text-edit-profile-button rounded-xl border-2 border-edit-profile-button p-2 bg-white self-end mb-4`}>Edit Profile</a>
          <div className='flex flex-col gap-10'>
            <div className={`bg-white border rounded-2xl px-4 md:px-4 lg:px-5 py-6 md:py-6 lg:py-8 drop-shadow-sm`}>
              <h2 className={`${robotoCondensed.className} text-xl md:text-2xl lg:text-3xl font-medium font-weight-500 p-3 mb-5`}>Profile Information</h2>
              <hr className='mb-5'></hr>
              <h3 className={`text-base md:text-lg lg:text-xl font-medium p-3`}>Name</h3>
              <div className='flex p-2 items-center gap-2 mb-5'>
                <User className="text-primary" />
                <p>{dashboardData?.name}</p>
              </div>
              <hr className='mb-4'></hr>
              <h3 className={`text-base md:text-lg lg:text-xl font-medium p-3`}>Contact Information</h3>
              <div className='flex p-2 items-center gap-2'>
                <Mail className="text-primary" />
                <p>{dashboardData?.contact.email}</p>
              </div>
              {dashboardData?.contact.phone && (
                <div className='flex p-2 items-center gap-2'>
                  <Phone className="text-primary" />
                  <p>{dashboardData.contact.phone}</p>
                </div>
              )}
              {dashboardData?.contact.address && (
                <div className='flex p-2 items-center gap-2'>
                  <MapPin className="text-primary" />
                  <p>{dashboardData.contact.address}</p>
                </div>
              )}
            </div>
            <div className={`bg-white border rounded-2xl px-4 md:px-4 lg:px-5 py-6 md:py-6 lg:py-8 drop-shadow-sm mb-15`}>
              <h2 className={`${robotoCondensed.className} text-xl md:text-2xl lg:text-3xl font-medium p-3 mb-5`}>Application Responses</h2>
              <hr className='mb-5'></hr>
              <div>
                <h3 className={`${subheaderStyles.s} text-content-secondary p-3`}>Membership Interests</h3>
                <div className={`flex flex-wrap gap-3 p-2 items-center mb-5`}>
                  {(dashboardData?.interests ?? []).map((interest: string, idx: number) => (
                    <p className={`${buttonStyles.text} text-content-secondary rounded-4xl border p-3 px-6 border-content-secondary`} key={idx}>{interest}</p>
                  ))}
                </div>
                <h3 className={`${subheaderStyles.s} text-content-secondary p-3`}>Why do you want to be an RPRC member?</h3>
                <p className={`${bodyStyles.lg} text-content-primary rounded-2xl border border-1 border-application-detail-border-50 bg-card-background-gray p-5`}>{dashboardData?.reason}</p>
              </div>
              <hr className='mb-10 mt-10'></hr>
              <div>
                <a className={`text-destructive-default underline p-3`}>Delete Profile</a>
                <p className='p-3 text-content-secondary'>You can delete your profile if you wish to cancel your membership.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
