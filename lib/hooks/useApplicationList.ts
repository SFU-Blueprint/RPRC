'use client';

import { useCallback, useMemo, useState } from 'react';
import type { ApplicationType } from '@/types/admin.types';

type Tab = {
  label: string;
  value: string;
};

type UseApplicationListOptions = {
  applications: ApplicationType[];
  currentTab: Tab;
  searchQuery?: string;
  pagination?: {
    itemCount: number;
    numberPerPage: number;
  };
};

export function useApplicationList({
  applications,
  currentTab,
  searchQuery = '',
  pagination,
}: UseApplicationListOptions) {
  const key = `${currentTab.value}::${searchQuery}`;
  const [pageState, setPageState] = useState({ key, page: 1 });
  const currentPage = pageState.key === key ? pageState.page : 1;

  const setCurrentPage = useCallback(
    (page: number) => {
      setPageState({ key, page });
    },
    [key],
  );

  const filteredApplications = useMemo(() => {
    if (currentTab.value === 'all') return applications;
    return applications.filter((app) => app.status === currentTab.value);
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
