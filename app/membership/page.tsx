'use client';

import Link from 'next/link';
import { inter } from '@/app/fonts';

export default function MembershipLandingPage() {
  return (
    <div className={`min-h-screen bg-[#f7f6f1] ${inter.className}`}>
      {/* Hero Section */}
      <div className="bg-[#f7f6f1] pt-6 pb-4 sm:pt-8 sm:pb-5 md:pt-10 md:pb-6 lg:pt-12 lg:pb-7">
        <div className="max-w-[1920px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <h1 className="text-center font-semibold text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[52px] text-gray-900 leading-tight">
            Join our community and make a difference
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-6 sm:py-10 md:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          {/* Left: What it means to be a member */}
          <div className="bg-[#eeebe0] rounded-[25px] p-6 sm:p-7 md:p-8 lg:p-9 xl:p-10">
            <h2 className="font-bold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] mb-5 sm:mb-6 text-gray-900">
              What it means to be a member
            </h2>

            <div className="space-y-4 text-gray-800">
              <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-relaxed">
                Membership is a way for community members to actively support
                poverty reduction in Richmond. By becoming a member, you or your
                organization:
              </p>

              <ul className="space-y-3 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px]">
                <li className="flex items-start">
                  <span className="mr-3 mt-1">•</span>
                  <span>
                    Have voting rights at the Annual General Meeting (AGM).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1">•</span>
                  <span>
                    Are the first to receive news, advocacy updates, event
                    invitations, and project involvement opportunities outside
                    of the newsletter subscription.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1">•</span>
                  <span>
                    Support and endorse RPRC&apos;s mission and values.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1">•</span>
                  <span>
                    At the moment, members do not have formal volunteer duties,
                    but they are encouraged to participate in events, share
                    advocacy messages, and help build community relationships.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Two Pathway Cards */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            {/* New Member Card */}
            <div className="bg-white rounded-[25px] border-2 border-[#90cd5f] p-6 sm:p-7 md:p-8 lg:p-9 xl:p-10 shadow-sm">
              <h3 className="font-bold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] mb-4 text-gray-900">
                New Member?
              </h3>

              <p className="text-gray-700 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] mb-6 leading-relaxed">
                Create an account and join the Richmond Policy Research
                Collective to participate in events, vote at AGMs, and stay
                updated on policy initiatives.
              </p>

              <Link href="/membership/signup">
                <button className="w-full bg-[#90cd5f] hover:bg-[#80bd4f] text-white font-semibold text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] xl:text-[20px] py-3 sm:py-3.5 md:py-4 rounded-lg transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>

            {/* Existing Member Card */}
            <div className="bg-white rounded-[25px] border-2 border-[#383533] p-6 sm:p-7 md:p-8 lg:p-9 xl:p-10 shadow-sm">
              <h3 className="font-bold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] mb-4 text-gray-900">
                Existing Member?
              </h3>

              <p className="text-gray-700 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] mb-6 leading-relaxed">
                Sign in to your account to access your membership profile, view
                upcoming events, and manage your preferences.
              </p>

              <Link href="/membership/login">
                <button className="w-full bg-[#383533] hover:bg-[#2a2725] text-white font-semibold text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] xl:text-[20px] py-3 sm:py-3.5 md:py-4 rounded-lg transition-colors">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
