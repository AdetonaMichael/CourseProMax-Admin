'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DollarSign, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { Card, LoadingSkeleton, StatCard } from '@/components/dashboard/DashboardComponents';
import {
  fetchRevenueAnalytics,
  handleInstructorAPIError,
  RevenueAnalytics,
} from '@/services/instructor.service';

export default function EarningsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRevenueAnalytics();
        setRevenueData(data);
      } catch (err) {
        console.error('Error loading revenue:', err);
        setError(handleInstructorAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      loadRevenue();
    }
  }, [status]);

  if (loading) {
    return (
      <InstructorLayout>
        <LoadingSkeleton count={4} />
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earnings & Analytics</h1>
        <p className="text-gray-600 mt-1">Track your revenue and performance</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-red-900">{error.title}</h3>
            <p className="text-red-800 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {revenueData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`₦${(revenueData.total_revenue || 0).toLocaleString()}`}
              description="All-time earnings"
              icon={<DollarSign size={28} className="text-green-600" />}
            />
            <StatCard
              title="This Month"
              value={`₦${(revenueData.this_month_revenue || 0).toLocaleString()}`}
              description="Current month earnings"
              icon={<TrendingUp size={28} className="text-blue-600" />}
            />
            <StatCard
              title="Last Month"
              value={`₦${(revenueData.last_month_revenue || 0).toLocaleString()}`}
              description="Previous month earnings"
              icon={<BarChart3 size={28} className="text-gray-600" />}
            />
          </div>

          {/* Revenue Trend */}
          <Card title="Revenue Trend" className="mb-8">
            <div className="text-center py-8">
              <p className="text-3xl font-bold text-gray-900">{revenueData.revenue_trend || 'N/A'}</p>
              <p className="text-gray-600 mt-2">Compared to last period</p>
            </div>
          </Card>

          {/* Revenue by Course */}
          {revenueData.revenue_by_course && revenueData.revenue_by_course.length > 0 && (
            <Card title="Revenue by Course" className="mb-8">
              <div className="space-y-4">
                {revenueData.revenue_by_course.map((course, idx) => (
                  <div key={idx} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{course.course_title}</h4>
                      <span className="text-sm font-semibold text-green-600">
                        ₦{course.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${course.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{course.percentage.toFixed(1)}% of total</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Revenue by Period */}
          {revenueData.revenue_by_period && revenueData.revenue_by_period.length > 0 && (
            <Card title="Revenue History">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Enrollments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.revenue_by_period.map((period, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800">{period.period}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ₦{period.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">{period.enrollments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </InstructorLayout>
  );
}
