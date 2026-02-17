import { Calendar, StepForward, User } from 'lucide-react';

export const INFO_CARDS = [
  {
    ID: 1,
    ICON: User,
    HEADING: 'Check Your Email',
    DESCRIPTION:
      'A confirmation email has been sent to your registered email address, further about your application status will be sent here.',
  },
  {
    ID: 2,
    ICON: User,
    HEADING: 'View Your Profile',
    DESCRIPTION:
      'All following steps will be done through the applicant profile including viewing membership status.',
  },
  {
    ID: 3,
    ICON: Calendar,
    HEADING: 'Review Period',
    DESCRIPTION:
      'Our team will review your application within 14 business days.',
  },
  {
    ID: 4,
    ICON: StepForward,
    HEADING: 'Next Steps',
    DESCRIPTION:
      "Once approved, you'll receive payment instructions. After confirmation, your membership will be activated.",
  },
];
