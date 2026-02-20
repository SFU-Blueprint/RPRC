import { inter } from '@/app/fonts';
import { Mail, Phone, MapPin, Calendar, User, Building } from 'lucide-react';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import { APPLICATION_DETAIL_ICON_SIZES } from '@/lib/constants/admin';
import { ApplicationType } from '@/lib/constants';

type ApplicationDetailsProps = {
  type: ApplicationType;
  interests: string[];
  reason: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  dateReceived: string;
};

type DetailFieldProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

function DetailField({ label, value, icon }: DetailFieldProps) {
  return (
    <BackdropContainer className="flex flex-col sm:flex-row justify-center items-center gap-x-4 border border-application-detail-blue-500 bg-application-detail-blue-100 shadow-none">
      {icon && <div className="bg-application-detail-blue-500 p-2 rounded-full text-white h-10 w-10 sm:h-15 sm:w-15 flex items-center justify-center">{icon}</div>}
      <div className="flex flex-col ">
        <p className="text-application-detail-text-secondary font-bold text-xs sm:text-lg text-center sm:text-left mt-4 sm:mt-0">{label}</p>
        <p className="text-application-detail-text-primary font-bold text-2xs sm:text-xl text-center sm:text-left mt-2 sm:mt-0">{value}</p>
      </div>
    </BackdropContainer>
  );
}

type ContactItemProps = {
  icon: React.ReactNode;
  text: string;
};

function ContactItem({ icon, text }: ContactItemProps) {
  return (
    <div className="flex justify-left items-center gap-x-3">
      <div className="text-application-detail-accent-green">{icon}</div>
      <p className="text-application-detail-text-primary break-words">{text}</p>
    </div>
  );
}

export default function ApplicationDetails({
  type,
  interests,
  reason,
  contact,
  dateReceived,
}: ApplicationDetailsProps) {

  const typeIcon = type === ApplicationType.INDIVIDUAL
    ? <User size={APPLICATION_DETAIL_ICON_SIZES.LARGE} />
    : <Building size={APPLICATION_DETAIL_ICON_SIZES.LARGE} />;

  const typeText = type === ApplicationType.INDIVIDUAL ? 'Individual' : 'Organization';
  return (
    <BackdropContainer className="bg-application-detail-background border border-application-detail-border-50 p-5 rounded-lg flex flex-col gap-y-6 mt-6">
      {/* Top Row */}
      <div className="grid grid-cols-2 gap-6">
        <DetailField label="Type" value={typeText} icon={typeIcon} />
        <DetailField label="Date Received" value={dateReceived} icon={<Calendar size={APPLICATION_DETAIL_ICON_SIZES.LARGE} />} />
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col sm:flex-row gap-x-6 gap-y-6 justify-center">
        <BackdropContainer className="bg-white border border-1 border-application-detail-border-100 shadow-none">
          <div>
            <p className="text-application-detail-text-primary font-bold mb-4">Why do you want to be an RPRC member?</p>
            <p className="text-application-detail-text-secondary">{reason}</p>
          </div>
        </BackdropContainer>

        <div className="flex flex-col gap-y-6">
          <BackdropContainer className="bg-white border border-1 border-application-detail-border-100 shadow-none">
            <p className="text-application-detail-text-primary font-bold mb-2">Membership Interests</p>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-application-detail-border-100 rounded-full text-application-detail-text-primary"
                >
                  {interest}
                </span>
              ))}
            </div>
          </BackdropContainer>
          <BackdropContainer className="bg-white border border-1 border-application-detail-border-100 shadow-none">
            <p className="text-application-detail-text-primary font-bold mb-2">Contact Information</p>
            <div className="flex flex-col gap-y-4">
              <ContactItem icon={<Mail size={APPLICATION_DETAIL_ICON_SIZES.SMALL} />} text={contact.email} />
              <ContactItem icon={<Phone size={APPLICATION_DETAIL_ICON_SIZES.SMALL} />} text={contact.phone} />
              <ContactItem icon={<MapPin size={APPLICATION_DETAIL_ICON_SIZES.SMALL} />} text={contact.address} />
            </div>
          </BackdropContainer>
        </div>


      </div>
    </BackdropContainer>
  );
}
