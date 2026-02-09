'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { subheaderStyles, bodyStyles } from '@/app/fonts';

export const HomePageForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic
    console.log('Sign in attempt:', formData);
  };

  return (
    <div className="rounded-3xl p-8 md:p-10 lg:p-12 bg-white shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
      <h3 className={`${subheaderStyles.s} mb-4 text-gray-900`}>
        Existing Member?
      </h3>

      <p className="text-gray-700 text-xs mb-6">
        Sign in to your account to access your membership profile, view
        upcoming events, and manage your preferences.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 text-gray-500">
        {/* Email Address */}
        <div>
          <Label htmlFor="email" className="text-xs">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
            className='mt-1'
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-xs">
            Password <span className="text-destructive">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter your password"
            required
            className='mt-1'
          />
        </div>

        {/* Forgot password link */}
        <div>
          <Link href="/auth/forgot-password" className="text-xs font-medium underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="bg-primary-black mx-auto block w-fit">
            Log In
          </Button>
        </div>

        {/* Sign up link */}
        <p className='text-gray-700 text-center text-xs'>
          Don&apos;t have an account?{' '}
          <Link
            href="/membership/signup"
            className="text-primary hover:text-primary/80 font-medium underline"
          >
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};
