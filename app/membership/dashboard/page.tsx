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
import { ApplicationStatus, ApplicationType, UserRole, type PhoneType } from '@/lib/constants/enums';
import { MEMBER_DASHBOARD, ORGANIZATION_MEMBER_DASHBOARD } from '@/lib/mock-data';
import type { MemberDashboardData, OrganizationMemberDashboardData } from '@/types/membership.types';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MembershipDashboard() {
  const [profiles, setProfiles] = useState<Record<ApplicationType, MemberDashboardData>>({
    [ApplicationType.INDIVIDUAL]: MEMBER_DASHBOARD,
    [ApplicationType.ORGANIZATION]: ORGANIZATION_MEMBER_DASHBOARD,
  });
  const [selectedRole, setSelectedRole] = useState<ApplicationType>(ApplicationType.INDIVIDUAL);
  const [isMembershipActionModalOpen, setIsMembershipActionModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] = useState(false);
  const profileEditFormId = 'membership-profile-edit-form';
  const dashboardData = profiles[selectedRole];
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
    if (!hasProfileChanges) return;

    setIsSavingProfile(true);

    try {
      const digits = values.phoneNumber.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
      const phone = `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      const addressFields = {
        mailingAddress: values.address.mailingAddress,
        city: values.address.city,
        province: values.address.province,
        country: values.address.country,
        postalCode: values.address.postalCode,
      };
      const updatedData = {
        ...dashboardData,
        type: values.role,
        name: values.name,
        contact: {
          ...dashboardData.contact,
          phone,
          phoneType: values.phoneType.toLowerCase() as PhoneType,
          address: [
            addressFields.mailingAddress,
            addressFields.city,
            addressFields.province,
            addressFields.country,
            addressFields.postalCode,
          ].filter(Boolean).join(', '),
          addressFields,
        },
        interests: values.membershipInterests,
        reason: values.motivation,
      };
      const profile: MemberDashboardData = values.role === UserRole.ORGANIZATION
        ? {
            ...updatedData,
            type: ApplicationType.ORGANIZATION,
            representativeName: values.representativeName,
            representativeEmail: values.representativeEmail ?? '',
            servicesOffered: values.programsOrServices ?? '',
          } as OrganizationMemberDashboardData
        : { ...updatedData, type: ApplicationType.INDIVIDUAL };

      // Keep the profile editor interactive without persisting data in the local demo.
      setProfiles((current) => ({ ...current, [values.role]: profile }));
      setHasProfileChanges(false);
      setIsEditingProfile(false);
      toast.success('Demo profile updated locally. Changes are not saved.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
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
              <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-5'>
                <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
                  <h2 className={`${robotoCondensed.className} text-xl md:text-2xl lg:text-3xl font-medium p-3`}>Profile Information</h2>
                  <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                    <label htmlFor="demo-profile-role" className="sr-only">Profile type</label>
                    <Select
                      value={selectedRole}
                      onValueChange={(value) => setSelectedRole(value as ApplicationType)}
                      disabled={isEditingProfile || isSavingProfile || isMembershipActionModalOpen}
                    >
                      <SelectTrigger id="demo-profile-role" className="w-44 bg-white text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ApplicationType.INDIVIDUAL}>Individual</SelectItem>
                        <SelectItem value={ApplicationType.ORGANIZATION}>Organization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {canEdit && (
                  <div className='shrink-0'>
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
                <OrganizationProfile data={dashboardData as OrganizationMemberDashboardData} />
              ) : (
                <IndividualProfile data={dashboardData} />
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
