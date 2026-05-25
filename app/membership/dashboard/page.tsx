'use client';

import { useState } from 'react';
import { inter, robotoCondensed, headerStyles, bodyStyles, buttonStyles } from '@/lib/fonts';
import { Info } from 'lucide-react';
import '@/app/globals.css';
import MembershipStatusCard from '@/components/membership/MembershipStatusCard';
import MembershipProfileBanner from '@/components/membership/MembershipProfileBanner';
import MembershipActionModal from '@/components/membership/modals/MembershipActionModal';
import IndividualProfile from '@/components/membership/profiles/IndividualProfile';
import OrganizationProfile from '@/components/membership/profiles/OrganizationProfile';
import MembershipProfileEditForm, { type MembershipProfileEditValues } from '@/components/membership/MembershipProfileEditForm';
import DiscardChangesModal from '@/components/membership/modals/DiscardChangesModal';
import { ApplicationStatus, UserRole } from '@/lib/constants/enums';
import { MEMBER_DASHBOARD } from '@/lib/mock-data';
import type { MemberDashboardData, OrganizationMemberDashboardData } from '@/types/membership.types';
import { toast } from 'sonner';

export default function MembershipDashboard() {
  const [dashboardData, setDashboardData] = useState<MemberDashboardData | null>(
    MEMBER_DASHBOARD,
  );
  const [isMembershipActionModalOpen, setIsMembershipActionModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] = useState(false);
  const profileEditFormId = 'membership-profile-edit-form';
  const canEdit = dashboardData?.status === ApplicationStatus.ACTIVE
    || dashboardData?.status === ApplicationStatus.EXPIRED
    || dashboardData?.status === ApplicationStatus.EXPIRES_SOON;

  const handleEditProfile = () => {
    setHasProfileChanges(false);
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    if (hasProfileChanges) {
      setIsDiscardChangesModalOpen(true);
      return;
    }

    setHasProfileChanges(false);
    setIsEditingProfile(false);
  };

  const handleDiscardChanges = () => {
    setIsDiscardChangesModalOpen(false);
    setHasProfileChanges(false);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async (values: MembershipProfileEditValues) => {
    if (!dashboardData) return;
    if (!hasProfileChanges) return;

    setIsSavingProfile(true);

    try {
      const updatedData: MemberDashboardData = {
        ...dashboardData,
        name: values.name,
        contact: {
          ...dashboardData.contact,
          phone: values.phone,
          phoneType: values.phoneType,
          address: [
            values.mailingAddress,
            values.city,
            values.province,
            values.country,
            values.postalCode,
          ].filter(Boolean).join(', '),
          addressFields: {
            mailingAddress: values.mailingAddress,
            city: values.city,
            province: values.province,
            country: values.country,
            postalCode: values.postalCode,
          },
        },
        interests: values.interests,
        reason: values.reason,
        ...(dashboardData.type === UserRole.ORGANIZATION && {
          representativeName: values.representativeName ?? '',
          representativeEmail: values.representativeEmail ?? '',
          servicesOffered: values.servicesOffered ?? '',
        }),
      };

      // Keep the profile editor interactive without persisting data in the local demo.
      setDashboardData(updatedData);
      setHasProfileChanges(false);
      setIsEditingProfile(false);
      toast.success('Demo profile updated locally. Changes are not saved.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <p className="px-6 pt-4 text-center text-sm text-muted-foreground">
        Demo profile data
      </p>
      <MembershipProfileBanner name={dashboardData?.name ?? ''} role={dashboardData?.type ?? null} />
      <div className='flex flex-col md:flex-row justify-center gap-8 md:gap-6 lg:gap-16 xl:gap-24 mt-8 md:mt-10 px-4 md:px-6 lg:px-12 xl:px-20 pb-16'>
        <div className='flex flex-col gap-8 md:gap-6 lg:gap-10 w-full md:w-auto md:shrink-0'>
          {dashboardData?.status && (
            <MembershipStatusCard
              status={dashboardData.status as ApplicationStatus}
              dateFinalized={dashboardData?.dateFinalized ?? ''}
              ctaDisabled={isEditingProfile || isSavingProfile}
              role={dashboardData?.type as UserRole}
              onConfirmInfo={() => setIsMembershipActionModalOpen(true)}
            />
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
          <div className='flex flex-col gap-10'>
            <div className='bg-white border rounded-2xl px-4 md:px-4 lg:px-5 py-6 md:py-6 lg:py-8 drop-shadow-sm'>
              <div className='flex items-center justify-between mb-5'>
                <h2 className={`${robotoCondensed.className} text-xl md:text-2xl lg:text-3xl font-medium p-3`}>Profile Information</h2>
                {canEdit && (
                  <div>
                    {isEditingProfile ? (
                      <>
                        <button
                          type='submit'
                          form={profileEditFormId}
                          className={`${buttonStyles.text} border-b-2 mr-4 ${hasProfileChanges && !isSavingProfile
                            ? 'text-black border-black hover:opacity-75'
                            : 'text-content-secondary border-content-secondary opacity-50 cursor-not-allowed'
                            }`}
                          disabled={!hasProfileChanges || isSavingProfile}
                        >
                          {isSavingProfile ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type='button'
                          className={`${buttonStyles.text} text-black border-b-2 border-black hover:opacity-75 mr-4`}
                          onClick={handleCancelEdit}
                          disabled={isSavingProfile}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type='button'
                        className={`${buttonStyles.text} text-black border-b-2 border-black hover:opacity-75 mr-4`}
                        onClick={handleEditProfile}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                )}
              </div>
              <hr className="mb-5 border-application-detail-border-50" />

              {isEditingProfile ? (
                dashboardData && (
                  <MembershipProfileEditForm
                    data={dashboardData}
                    onSave={handleSaveProfile}
                    isSaving={isSavingProfile}
                    formId={profileEditFormId}
                    onDirtyChange={setHasProfileChanges}
                  />
                )
              ) : dashboardData?.type === 'organization' ? (
                <OrganizationProfile data={dashboardData as OrganizationMemberDashboardData} onEdit={handleEditProfile} />
              ) : (
                <IndividualProfile data={dashboardData} onEdit={handleEditProfile} />
              )}
            </div>
            <div>
              <a className={`text-destructive-default underline p-3`}>Delete Profile</a>
              <p className='p-3 text-content-secondary'>You can delete your profile if you wish to cancel your membership.</p>
            </div>
          </div>
        </div>
      </div>
      <MembershipActionModal
        isOpen={isMembershipActionModalOpen}
        onClose={() => setIsMembershipActionModalOpen(false)}
        data={dashboardData}
      />
      <DiscardChangesModal
        isOpen={isDiscardChangesModalOpen}
        onClose={() => setIsDiscardChangesModalOpen(false)}
        onDiscard={handleDiscardChanges}
      />
    </div>
  );
}
