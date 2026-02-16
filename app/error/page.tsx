'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorType, ERROR_MESSAGES, type ErrorTypeValue } from '@/lib/constants/error-types';
import { ROUTES } from '@/lib/constants/routes';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import { AlertCircle } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorType = (searchParams.get('type') || ErrorType.SERVER_ERROR) as ErrorTypeValue;
  
  // Get error details from constants
  const errorDetails = ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.SERVER_ERROR];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div
        className={`bg-card-background-gray rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-md w-full ${inter.className}`}
      >
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        {/* Error Title */}
        <h1
          className={`text-gray-900 mb-4 text-center ${headerStyles.lResponsive} ${robotoCondensed.className}`}
        >
          {errorDetails.title}
        </h1>

        {/* Error Description */}
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="text-center">
            {errorDetails.description}
          </AlertDescription>
        </Alert>

        {/* Back to Home Button */}
        <Link href={ROUTES.HOME} className="block">
          <Button className="w-full" size="md">
            Back to Home
          </Button>
        </Link>

        {/* Support link */}
        <div className="mt-8 text-center">
          <p className={`text-gray-600 text-sm ${bodyStyles.s}`}>
            Need help?{' '}
            <a href="mailto:support@rprc.org" className="text-[#5EB42D] hover:text-[#2B8100] font-medium underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
