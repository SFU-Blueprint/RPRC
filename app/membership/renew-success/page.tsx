'use client';

import { useEffect, useState } from 'react';
import { SignUpProvider, useSignUp } from '@/lib/contexts/SignUpContext';
import { inter } from '@/app/fonts';
import { Step2Form } from '@/components/signup/Pages/Step2Form';
import { Step3Success } from '@/components/signup/Pages/Step3Success';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import MembershipProfileBanner from '@/components/membership/MembershipProfileBanner';
import { getUserRoleById } from '@/lib/api/services/application-service';
import { UserRole } from '@/lib/constants/enums';

function MembershipRenewContent() {
    const { user, loading } = useAuth();
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        getUserRoleById(user.id).then((r) => setRole((r as UserRole) ?? null));
    }, [user?.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="size-6 text-gray-600" />
            </div>
        );
    }

    const name = user?.user_metadata?.full_name ?? user?.email ?? '';

    return (
        <div className={inter.className}>
            <MembershipProfileBanner name={name} role={role} />

            <div className="max-w-screen-2xl mx-auto pb-12 md:pb-16 lg:pb-20 mt-10">
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[80%]">
                        <Step3Success />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MembershipRenewPage() {
    return (
        <SignUpProvider initialStep={2}>
            <MembershipRenewContent />
        </SignUpProvider>
    );
}
