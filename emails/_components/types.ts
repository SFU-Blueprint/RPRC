/** Props every status email gets from the send helper. */
export type BaseEmailProps = {
  /** Greeting name: the applicant's name, or the organization's name. Empty for "Hi,". */
  name: string;
  /** Absolute site origin, e.g. `https://portal.richmondprc.org`. */
  siteUrl: string;
};

/** Sample values for the React Email preview server. */
export const PREVIEW_BASE_PROPS: BaseEmailProps = {
  name: 'Alex Chen',
  siteUrl: 'http://localhost:3000',
};
