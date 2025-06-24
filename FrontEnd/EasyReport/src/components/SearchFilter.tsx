import React from 'react';

type Props = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  searchBy: string;
  setSearchBy: (val: string) => void;
  filters: { type: string; date: string; status: string };
  setFilters: (val: any) => void;
};

const SearchFilter: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  searchBy,
  setSearchBy,
  filters,
  setFilters,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-white text-black border border-gray-300 rounded px-4 py-2"
        />
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="bg-white text-black border border-gray-300 rounded px-3 py-2"
        >
          <option value="email">Email</option>
          <option value="name">Name</option>
          <option value="phone">Phone</option>
          <option value="id">Patient ID</option>
          <option value="testId">Test ID</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <input
          type="text"
          placeholder="Type"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="bg-white text-black border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="bg-white text-black border border-gray-300 rounded px-4 py-2"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-white text-black border border-gray-300 rounded px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="created">Created</option>
          <option value="processing">Processing</option>
          <option value="finished">Finished</option>
        </select>
      </div>
    </>
  );
};

export default SearchFilter;