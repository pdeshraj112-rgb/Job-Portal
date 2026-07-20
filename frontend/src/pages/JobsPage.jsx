import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import JobList from '../components/job/JobList';
import JobFilters from '../components/job/JobFilters';
import Pagination from '../components/common/Pagination';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    category: searchParams.get('category') || '',
    page: Number(searchParams.get('page')) || 1,
  }), [searchParams]);

  const { data, loading, error } = useFetch('/jobs', filters);

  const applyFilters = (next) => {
    const params = {};
    Object.entries(next).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params);
  };

  const changePage = (page) => applyFilters({ ...filters, page });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-800">
        {data ? `${data.total} jobs found` : 'Browse jobs'}
      </h1>
      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <JobFilters filters={filters} onChange={applyFilters} />
        <div>
          <JobList jobs={data?.jobs} loading={loading} error={error} />
          {data && <Pagination page={data.page} pages={data.pages} onChange={changePage} />}
        </div>
      </div>
    </div>
  );
}
