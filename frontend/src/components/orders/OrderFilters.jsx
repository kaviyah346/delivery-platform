import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function OrderFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onReset,
  totalResults,
}) {
  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'Delivered', value: 'DELIVERED' },
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: 'ALL' },
    { label: 'High Priority', value: 'HIGH' },
    { label: 'Medium Priority', value: 'MEDIUM' },
    { label: 'Low Priority', value: 'LOW' },
  ];

  const hasActiveFilters = search || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-ups-gray-border mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ups-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer, address, or phone..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-ups-gray-bg border border-ups-gray-border rounded-lg text-ups-text-dark placeholder-ups-text-muted focus:outline-none focus:ring-2 focus:ring-ups-gold focus:border-transparent transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ups-text-muted hover:text-ups-brown"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-ups-gray-bg border border-ups-gray-border rounded-lg text-ups-text-dark focus:outline-none focus:ring-2 focus:ring-ups-gold focus:border-transparent font-medium"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="w-full md:w-44">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-ups-gray-bg border border-ups-gray-border rounded-lg text-ups-text-dark focus:outline-none focus:ring-2 focus:ring-ups-gold focus:border-transparent font-medium"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-ups-brown hover:bg-amber-50 rounded-lg border border-amber-200 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Filter summary bar */}
      <div className="mt-3 pt-3 border-t border-ups-gray-border/60 flex items-center justify-between text-xs text-ups-text-muted">
        <span>
          Showing <strong className="text-ups-brown font-semibold">{totalResults}</strong> delivery {totalResults === 1 ? 'order' : 'orders'}
        </span>
        {hasActiveFilters && (
          <span className="text-amber-700 font-medium">
            Filtered view active
          </span>
        )}
      </div>
    </div>
  );
}
