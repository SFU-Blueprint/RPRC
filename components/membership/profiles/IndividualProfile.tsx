import { User, Mail, Phone, MapPin } from 'lucide-react';
import { bodyStyles, buttonStyles, subheaderStyles } from '@/app/fonts';
import type { IndividualMemberDashboardData } from '@/types/membership.types';

type Props = {
    data: IndividualMemberDashboardData | null;
    onEdit?: () => void;
};

export default function IndividualProfile({ data, onEdit }: Props) {
    if (!data) return null;

    return (
        <div>
            <h3 className="text-base md:text-lg lg:text-xl font-medium p-3">Name</h3>
            <div className="flex p-2 items-center gap-2 mb-5">
                <User className="text-primary" />
                <p className={bodyStyles.lg}>{data?.name ?? ''}</p>
            </div>
            <hr className="mb-5 border-application-detail-border-50" />
            <h3 className="text-base md:text-lg lg:text-xl font-medium p-3">Contact Information</h3>
            <div className="flex p-2 items-center gap-2">
                <Mail className="text-primary" />
                <p className={bodyStyles.lg}>{data?.contact?.email ?? ''}</p>
            </div>
            <div className="flex p-2 items-center gap-2">
                <Phone className="text-primary" />
                <p className={bodyStyles.lg}>{data?.contact?.phone ?? ''}</p>
            </div>
            <div className="flex p-2 items-center gap-2 mb-5">
                <MapPin className="text-primary" />
                <p className={bodyStyles.lg}>{data?.contact?.address ?? ''}</p>
            </div>
            <hr className="mb-5 border-application-detail-border-50" />
            <div>
                <div className='flex items-center justify-between mb-1'>
                    <h2 className='text-base md:text-lg lg:text-xl font-medium p-3'>Membership Information</h2>
                </div>
                <h3 className={`${subheaderStyles.s} text-content-secondary p-3`}>Membership Interests</h3>
                <div className='flex flex-wrap gap-3 p-2 items-center mb-5'>
                    {data.interests.map((interest, idx) => (
                        <p
                            key={idx}
                            className={`${buttonStyles.textSmall} text-content-secondary rounded-4xl border p-3 px-6 border-content-secondary`}
                        >
                            {interest}
                        </p>
                    ))}
                </div>
                <h3 className={`${subheaderStyles.s} text-content-secondary p-3`}>Why do you want to be an RPRC member?</h3>
                <p className={`${bodyStyles.lg} text-content-primary rounded-2xl border border-1 border-application-detail-border-50 bg-card-background-gray p-5`}>
                    {data.reason}
                </p>
            </div>
        </div>
    );
}
