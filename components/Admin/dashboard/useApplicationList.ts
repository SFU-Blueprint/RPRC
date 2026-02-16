'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApplicationType } from '@/types/admin.types';

type Tab = {
  label: string;
  value: string;
};

/** Map tab value ) */
const TAB_VALUE_TO_STATUS: Record<string, string> = {
  toReview: 'to_review',
  paymentPending: 'payment_pending',
  active: 'active',
  expired: 'expired',
  rejected: 'rejected',
  conflict: 'conflict',
};

type UseApplicationListOptions = {
  applications: ApplicationType[];
  currentTab: Tab;
  pagination?: {
    itemCount: number;
    numberPerPage: number;
  };
};

export function useApplicationList({
  applications,
  currentTab,
  pagination,
}: UseApplicationListOptions) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);

  const filteredApplications = useMemo(() => {
    if (currentTab.value === 'all') return applications;
    const status = TAB_VALUE_TO_STATUS[currentTab.value];
    return status ? applications.filter((app) => app.status === status) : applications;
  }, [applications, currentTab]);

  const paginatedApplications = useMemo(() => {
    if (!pagination) {
      return filteredApplications;
    }
    const startIndex = (currentPage - 1) * pagination.numberPerPage;
    const endIndex = startIndex + pagination.numberPerPage;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage, pagination]);

  return {
    filteredApplications,
    paginatedApplications,
    currentPage,
    setCurrentPage,
  };
}
