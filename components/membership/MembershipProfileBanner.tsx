'use client';

import { robotoCondensed } from '@/app/fonts';
import { User as UserIcon, Users as UsersIcon } from 'lucide-react';
import { UserRole } from '@/lib/constants/enums';

interface MembershipProfileBannerProps {
    name: string;
    role: UserRole | null;
}

export default function MembershipProfileBanner({ name, role }: MembershipProfileBannerProps) {
    const Icon = role === UserRole.ORGANIZATION ? UsersIcon : UserIcon;

    return (
        <div className="mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-10 bg-background-reverse flex gap-6 items-center border-b-8 border-primary">
            <div className='bg-primary rounded-full p-2 md:p-4 shrink-0'>
                <Icon color="white" size={48} className="md:hidden" />
                <Icon color="white" size={72} className="hidden md:block" />
            </div>
            <div className='flex flex-col justify-center gap-2 min-w-0'>
                <p className='text-sm md:text-m text-white'>RPRC Membership Profile</p>
                <h1 className={`${robotoCondensed.className} text-2xl md:text-4xl lg:text-5xl font-medium font-weight-500 text-white truncate`}>
                    Hello, {name}!
                </h1>
            </div>
        </div>
    );
}
