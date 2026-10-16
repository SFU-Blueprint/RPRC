'use client';

import { useState } from 'react';
import { ROUTES } from '@/lib/constants/routes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Password reset is unavailable while the membership backend is disabled.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className={`bg-card-background-gray rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-md w-full ${inter.className}`}>
        <h2 className={`text-gray-900 mb-6 text-center ${headerStyles.lResponsive} ${robotoCondensed.className}`}>Reset your password</h2>
        <p className={`text-gray-700 mb-6 text-center ${bodyStyles.m}`}>Enter your email address to preview the password reset form.</p>
        {notice && <Alert variant="info" className="mb-6"><AlertDescription>{notice}</AlertDescription></Alert>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2"><Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required /></div>
          <Button type="submit" disabled={!email} size="md" className="w-full">Preview reset request</Button>
          <div className="text-center"><Link href={ROUTES.HOME} className="text-gray-700 hover:text-gray-900 text-sm underline">Back to sign in</Link></div>
        </form>
      </div>
    </div>
  );
}
