'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApplicationType } from '@/types/admin.types';

type Tab = {
  label: string;
  value: string;
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
    return applications.filter((app) =>
      currentTab.value !== 'all' ? app.status === currentTab.value : true,
    );
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
