'use client';

import { useState } from 'react';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordInput } from '@/components/signup/inputs/PasswordInput';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    setConfirmPasswordError('');
    setNotice('Password changes are unavailable while the membership backend is disabled.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className={`bg-card-background-gray rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-md w-full ${inter.className}`}>
        <h2 className={`text-gray-900 mb-6 text-center ${headerStyles.lResponsive} ${robotoCondensed.className}`}>Set new password</h2>
        <p className={`text-gray-700 mb-6 text-center ${bodyStyles.m}`}>Preview the password reset form.</p>
        {notice && <Alert variant="info" className="mb-6"><AlertDescription>{notice}</AlertDescription></Alert>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordInput label="New Password" value={password} showValidation={hasAttemptedSubmit} onChange={(value) => setPassword(value)} placeholder="Enter your new password" required showRequirements />
          <PasswordInput label="Confirm New Password" value={confirmPassword} error={confirmPasswordError} showValidation={hasAttemptedSubmit} onChange={(value) => { setConfirmPassword(value); setConfirmPasswordError(''); }} placeholder="Re-enter your new password" required showRequirements={false} />
          <Button type="submit" disabled={!password || !confirmPassword} size="lg" className="w-full">Preview password change</Button>
          <div className="text-center"><Link href={ROUTES.HOME} className="text-gray-700 hover:text-gray-900 text-sm underline">Back to sign in</Link></div>
        </form>
      </div>
    </div>
  );
}
