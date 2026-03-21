'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DollarSign, TrendingUp, AlertTriangle, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { Card, LoadingSkeleton, StatCard } from '@/components/dashboard/DashboardComponents';
import {
  fetchRevenueAnalytics,
  handleInstructorAPIError,
  RevenueAnalytics,
} from '@/services/instructor.service';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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

  // Color palette for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Calculate growth percentage
  const growthPercentage =
    revenueData && revenueData.last_month_revenue > 0
      ? (((revenueData.this_month_revenue - revenueData.last_month_revenue) / revenueData.last_month_revenue) * 100).toFixed(1)
      : 0;

  const isGrowth = parseFloat(String(growthPercentage)) >= 0;

  return (
    <InstructorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Earnings & Analytics</h1>
        <p className="text-gray-600 mt-2">Track your revenue, performance, and growth trends</p>
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
          {/* Key Metrics - Simplified Gray System */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Revenue Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-900 rounded-lg p-3">
                  <DollarSign size={24} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">All-time</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">₦{(revenueData.total_revenue || 0).toLocaleString()}</h3>
            </div>

            {/* This Month Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-900 rounded-lg p-3">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${isGrowth ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
                  {isGrowth ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(parseFloat(String(growthPercentage)))}%
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
              <h3 className="text-2xl font-bold text-gray-900">₦{(revenueData.this_month_revenue || 0).toLocaleString()}</h3>
            </div>

            {/* Last Month Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-900 rounded-lg p-3">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Previous</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Last Month</p>
              <h3 className="text-2xl font-bold text-gray-900">₦{(revenueData.last_month_revenue || 0).toLocaleString()}</h3>
            </div>

            {/* Trend Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-900 rounded-lg p-3">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Status</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Trend</p>
              <h3 className="text-2xl font-bold text-gray-900 capitalize">{revenueData.revenue_trend || 'Stable'}</h3>
            </div>
          </div>

          {/* Revenue by Course - Bar & Pie Charts */}
          {revenueData.revenue_by_course && revenueData.revenue_by_course.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Bar Chart */}
              <Card title="Revenue by Course" className="h-full">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={revenueData.revenue_by_course}
                    margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="course_title"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      interval={0}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value) => `₦${(value as number).toLocaleString()}`}
                      labelStyle={{ color: '#1f2937' }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart & Statistics */}
              <Card title="Revenue Distribution" className="h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueData.revenue_by_course}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${((entry.percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {revenueData.revenue_by_course.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => `₦${(value as number).toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Course Breakdown List */}
                  <div className="w-full mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Course Breakdown</h4>
                    <div className="space-y-3">
                      {revenueData.revenue_by_course.map((course, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                            />
                            <span className="text-sm font-medium text-gray-700 truncate">{course.course_title}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₦{course.revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{course.percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Revenue History Chart */}
          {revenueData.revenue_by_period && revenueData.revenue_by_period.length > 0 && (
            <Card title="Revenue History & Trend" className="mb-8">
              <div className="flex flex-col">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={revenueData.revenue_by_period}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="period"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value) => `₦${(value as number).toLocaleString()}`}
                      labelStyle={{ color: '#1f2937' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 5 }}
                      activeDot={{ r: 7 }}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Revenue History Table Below Chart */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Detailed History</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Enrollments</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Avg per Enrollment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueData.revenue_by_period.map((period, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50 transition">
                            <td className="py-3 px-4 text-gray-800 font-medium">{period.period}</td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-900">
                              ₦{(period.revenue).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600">{period.enrollments}</td>
                            <td className="py-3 px-4 text-right text-gray-600">
                              ₦{period.enrollments > 0 ? Math.round(period.revenue / period.enrollments).toLocaleString() : 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </InstructorLayout>
  );
}
