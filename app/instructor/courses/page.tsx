'use client'

import { InstructorLayout } from '@/components/instructor/InstructorLayout'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'

export default function InstructorCoursesPage() {
  return (
    <InstructorLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Manage and create your courses</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button>Create Course</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard
          title="Web Development Basics"
          lessons={12}
          students={234}
          status="published"
        />
      </div>
      </div>
    </InstructorLayout>
  )
}

function CourseCard({
  title,
  lessons,
  students,
  status,
}: {
  title: string
  lessons: number
  students: number
  status: string
}) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600"></div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>📚 {lessons} lessons</p>
          <p>👥 {students} students enrolled</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {status}
          </span>
          <Button variant="ghost" size="sm">Manage</Button>
        </div>
      </div>
    </div>
  )
}
