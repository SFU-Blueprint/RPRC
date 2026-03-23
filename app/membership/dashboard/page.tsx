'use client';

import { inter, headerStyles, subheaderStyles, bodyStyles, buttonStyles } from '@/app/fonts';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { Info, Mail, MapPin, Phone, User } from 'lucide-react';

export default function MembershipDashboard() {
  const { user, loading } = useAuth();
  const interests = ["Health", "Education", "Arts + Culture"]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-6 text-gray-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <div className="mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-12 bg-background-reverse flex gap-2 items-center">
        <div className='bg-primary rounded-full p-2'>
          <User color="#FFFFFF" size={48}></User>
        </div>
        <div className='flex flex-col justify-center'>
          <p className='text-white'>RPRC Membership Profile</p>
          <h1 className={`${headerStyles.lResponsive} text-white mb-6`}>
            Welcome, {user?.email!}!
          </h1>
        </div>
      </div>
      <div className='flex justify-around mt-10'>
        <div className='flex flex-col gap-10'>
          <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-signup-primary-green-700">
            <p className={`rounded-3x1 border p-2 bg-primary-light text-content-active ${headerStyles.mResponsive} font-extrabold rounded-xl`}>Active Membership</p>
            <p className={`text-content-active ${subheaderStyles.s}`}>Valid until: December 31st,2026</p>
            <p className={`${bodyStyles.m} text-content-secondary`}>Memberships must be renewed annually at the start of each year.</p>
            <p className={`${bodyStyles.m} text-content-secondary`}>To vote at the Annual General Meeting, members must be registered at least 30 days in advance.</p>
          </div>
          <div className='bg-feedback-info p-5 border rounded-sm border-l-10 border-l-feedback-info-accent'>
            <div className={`flex gap-2 items-center mb-3`}>
              <Info color="#2d3fb4"></Info>
              <h2 className={`${headerStyles.xs} font-medium`}>Need Help?</h2>
            </div>
            <p className={`${bodyStyles.m}`}>For assistance, email - <span className='underline'>info@richmondprc.org</span></p>
          </div>
        </div>
        <div className='flex flex-col justify-around'>
          <a className={`${buttonStyles.text} text-interactive-feature-stroke rounded-xl border-2 border-interactive-feature-stroke p-2 bg-white self-end`}>Edit Profile</a>
          <div className={`bg-white border rounded-2xl p-5 drop-shadow-xl`}>
            <h2 className={`${headerStyles.mResponsive} p-3`}>Profile Information</h2>
            <hr></hr>
            <h3 className={`${subheaderStyles.m} p-3`}>Name</h3>
            <div className='flex p-2 items-center gap-2'>
              <User color='#5EB42D'></User>
              <p>Mark Vu</p>
            </div>
            <hr></hr>
            <h3 className={`${subheaderStyles.m} p-3`}>Contact Information</h3>
            <div className='flex p-2 items-center gap-2'>
              <Mail color='#5EB42D'></Mail>
              <p>{user?.email}</p>
            </div>
            <div className='flex p-2 items-center gap-2'>
              <Phone color='#5EB42D'></Phone>
              <p>+1 (123) 456-7890</p>
            </div>
            <div className='flex p-2 items-center gap-2'>
              <MapPin color='#5EB42D'></MapPin>
              <p>2007-258 Nelsons Court, New Westminster, BC, V3J09S</p>
            </div>
          </div>
          <div className={`bg-white border rounded-2xl p-5 drop-shadow-xl`}>
            <h2 className={`${headerStyles.mResponsive} p-3`}>Application Response</h2>
            <hr></hr>
            <div>
              <h3 className={`${subheaderStyles.m} p-3`}>Membership Interests</h3>
              <div className={`flex gap-2 p-3 items-center`}>
                {interests.map((interest, idx) => {
                  return <p className={`${buttonStyles.text} text-content-secondary rounded-2xl border p-3 border-content-secondary`} key={idx}>{interest}</p>
                })}
              </div>
              <h3 className={`${subheaderStyles.m} p-3`}>Why do you want to be an RPRC member?</h3>
              <p className={`p-3 ${bodyStyles.lg} rounded-2xl bg-card-background-gray p-2`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna ali.</p>
            </div>
            <hr></hr>
            <div>
              <a className={`text-destructive underline p-3`}>Delete Profile</a>
              <p className='p-3'>You can delete your profile if you wish to cancel your membership.</p>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
