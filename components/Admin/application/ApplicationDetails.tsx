import React from 'react';
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
    <BackdropContainer className="flex flex-col sm:flex-row justify-center items-center gap-x-4 border border-application-detail-blue-500 bg-application-detail-blue-100 shadow-none p-4">
      {icon && (
        <div className="bg-application-detail-blue-500 p-4 rounded-full text-white flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="flex flex-col">
        <p className="text-application-detail-text-secondary text-sm font-medium text-center sm:text-left mt-4 sm:mt-0">
          {label}
        </p>
        <p className="text-application-detail-text-primary font-semibold text-lg text-center sm:text-left mt-2 sm:mt-0">
          {value}
        </p>
      </div>
    </BackdropContainer>
  );
}

/** Helpers */
function sanitizeTel(phone: string) {
  // keep digits and leading +, remove other chars
  return phone.replace(/[^\d+]/g, '');
}

/** ContactItem that renders either plain text or an accessible link */
type ContactItemProps = {
  icon: React.ReactNode;
  text: string;
  href?: string;
  openInNewTab?: boolean;
};

function ContactItem({ icon, text, href, openInNewTab = false }: ContactItemProps) {
  const content = (
    <div className="flex items-center gap-x-3">
      <div className="text-application-detail-accent-green">{icon}</div>
      <span className="text-application-detail-text-primary break-words">{text}</span>
    </div>
  );

  if (!href) return <div>{content}</div>;

  const a11yProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    title: text,
    'aria-label': text,
    className: 'inline-block hover:underline',
    ...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  };

  return (
    <a href={href} {...a11yProps}>
      {content}
    </a>
  );
}

export default function ApplicationDetails({
  type,
  interests,
  reason,
  contact,
  dateReceived,
}: ApplicationDetailsProps) {
  const typeIcon =
    type === ApplicationType.INDIVIDUAL ? (
      <User size={APPLICATION_DETAIL_ICON_SIZES.MEDIUM} />
    ) : (
      <Building size={APPLICATION_DETAIL_ICON_SIZES.MEDIUM} />
    );

  const typeText = type === ApplicationType.INDIVIDUAL ? 'Individual' : 'Organization';

  return (
    <BackdropContainer className="bg-application-detail-background border border-application-detail-border-50 p-5 rounded-xl flex flex-col gap-y-6 mt-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailField label="Type" value={typeText} icon={typeIcon} />
        <DetailField
          label="Date Received"
          value={dateReceived}
          icon={<Calendar size={APPLICATION_DETAIL_ICON_SIZES.MEDIUM} />}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <BackdropContainer className="bg-white border border-1 border-application-detail-border-100 shadow-none w-full h-full p-4">
          <div>
            <p className="text-gray-900 font-bold mb-3">Why do you want to be an RPRC member?</p>
            <p className="text-application-detail-text-secondary">{reason}</p>
          </div>
        </BackdropContainer>

        <div className="flex flex-col gap-y-6 w-full h-full">
          <BackdropContainer className="bg-white border border-1 border-application-detail-border-100 shadow-none p-4">
            <p className="text-application-detail-text-primary font-bold mb-2">Membership Interests</p>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-5 py-2 text-sm border border-application-detail-border-100 rounded-full text-application-detail-text-primary"
                >
                  {interest}
                </span>
              ))}
            </div>
          </BackdropContainer>

          <BackdropContainer className="bg-white border border-1 border-application-detail-border-100 shadow-none p-4">
            <p className="text-application-detail-text-primary font-bold mb-2">Contact Information</p>
            <div className="flex flex-col gap-y-4">
              <ContactItem
                icon={<Mail size={APPLICATION_DETAIL_ICON_SIZES.SMALL} />}
                text={contact.email}
                href={`mailto:${contact.email}`}
              />

              <ContactItem
                icon={<Phone size={APPLICATION_DETAIL_ICON_SIZES.SMALL} />}
                text={contact.phone}
                href={`tel:${sanitizeTel(contact.phone)}`}
              />

              <ContactItem
                icon={<MapPin size={APPLICATION_DETAIL_ICON_SIZES.SMALL} />}
                text={contact.address}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                openInNewTab
              />
            </div>
          </BackdropContainer>
        </div>
      </div>
    </BackdropContainer>
  );
}