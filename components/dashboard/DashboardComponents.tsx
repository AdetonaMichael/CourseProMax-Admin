'use client';

import React from 'react';
import { Loader, Package } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string | React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  const isLucideIcon = React.isValidElement(icon);
  
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
        </div>
        <div className="ml-4 flex-shrink-0">
          {isLucideIcon ? (
            <div className="text-gray-600">{icon}</div>
          ) : (
            <div className="text-3xl">{icon}</div>
          )}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center space-x-1">
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
}

interface DataTableProps {
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
  actions?: {
    label: string;
    onClick: (row: any) => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

export function DataTable({
  columns,
  data,
  loading,
  onRowClick,
  actions,
}: DataTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <div className="flex justify-center mb-4">
          <Loader className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-gray-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2 flex">
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          action.variant === 'danger'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : action.variant === 'primary'
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-gray-200 rounded h-12 animate-pulse" />
        ))}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = <Package className="w-12 h-12 text-gray-400" />, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg p-12 text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
