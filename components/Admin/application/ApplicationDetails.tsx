import { inter } from '@/app/fonts';
import { Mail, Phone, MapPin } from 'lucide-react';

type ApplicationDetailsProps = {
  type: string;
  interests: string;
  reason: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
};

type DetailFieldProps = {
  label: string;
  value: string;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-[20px] leading-1.5 font-bold">{label}</p>
      <p>{value}</p>
    </div>
  );
}

type ContactItemProps = {
  icon: React.ReactNode;
  text: string;
};

function ContactItem({ icon, text }: ContactItemProps) {
  return (
    <div className="flex gap-x-3.25">
      {icon}
      <p>{text}</p>
    </div>
  );
}

export default function ApplicationDetails({
  type,
  interests,
  reason,
  contact,
}: ApplicationDetailsProps) {
  return (
    <div
      className={`bg-[#EFEBE0] rounded-4xl border-4 border-[#E6E3DA] p-12.5 mt-5 flex gap-x-15 ${inter.className}`}
    >
      {/* Left Column - Application Details */}
      <div className="flex-1 flex flex-col gap-y-6">
        <DetailField label="Membership Type:" value={type} />
        <DetailField label="Membership Interests:" value={interests} />
        <DetailField
          label="Why do you want to be an RPRC member?"
          value={reason}
        />
      </div>

      {/* Right Column - Contact Information */}
      <div className="flex-1">
        <p className="text-[20px] leading-1.5 font-bold">Contact Information</p>
        <div className="flex flex-col gap-y-4 mt-6">
          <ContactItem
            icon={<Mail size={27} strokeWidth={1} />}
            text={contact.email}
          />
          <ContactItem
            icon={<Phone size={27} strokeWidth={1} />}
            text={contact.phone}
          />
          <ContactItem
            icon={<MapPin size={27} strokeWidth={1} />}
            text={contact.address}
          />
        </div>
      </div>
    </div>
  );
}
