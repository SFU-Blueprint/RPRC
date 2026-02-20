import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/helpers/auth-helper';
import { ROUTES } from '@/lib/constants/routes';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect(ROUTES.HOME);
  return <>{children}</>;
}
