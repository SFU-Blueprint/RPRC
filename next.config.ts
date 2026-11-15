import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The old multi-step sign-up was replaced by the single-page forms under
  // /sign-up. Old links land on the type chooser; for a signed-in user
  // without an application, the proxy then picks the form for their role.
  async redirects() {
    return [
      {
        source: '/membership/signup',
        destination: '/sign-up',
        permanent: false,
      },
      { source: '/membership/form', destination: '/sign-up', permanent: false },
      {
        source: '/membership/confirmation',
        destination: '/membership/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
