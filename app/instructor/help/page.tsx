'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HelpCircle, Mail, MessageSquare, FileText, ExternalLink, BookOpenCheck, Users, BarChart3 } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';

export default function InstructorHelpPage() {
  const { status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const helpOptions = [
    {
      icon: <FileText size={24} className="text-blue-600" />,
      title: 'Documentation',
      description: 'Read our comprehensive guides and tutorials',
      link: '#',
    },
    {
      icon: <MessageSquare size={24} className="text-green-600" />,
      title: 'Contact Support',
      description: 'Get help from our support team',
      link: '#',
    },
    {
      icon: <Mail size={24} className="text-orange-600" />,
      title: 'Email Support',
      description: 'support@coursepromax.com',
      link: 'mailto:support@coursepromax.com',
    },
  ];

  const faqItems = [
    {
      question: 'How do I create a new course?',
      answer: 'Navigate to "My Courses" and click "New Course". Fill in your course details, add lessons, and publish when ready. You can also save as draft and publish later.',
    },
    {
      question: 'How can I track student progress?',
      answer: 'Go to any course and click on "Enrollments" to see detailed progress of all enrolled students. You can view individual student progress and engagement metrics.',
    },
    {
      question: 'When do I get paid?',
      answer: 'Payments are processed monthly. Make sure your payout information is verified in your Profile settings. Current balance can be viewed in the Earnings section.',
    },
    {
      question: 'Can I edit a published course?',
      answer: 'Yes, you can edit most course details at any time. Changes are applied immediately, but existing students will see the updated content.',
    },
    {
      question: 'How do I add lessons to my course?',
      answer: 'Open a course and go to the "Lessons" tab. Click "Add Lesson" to create new content. You can add videos, readings, quizzes, and assignments.',
    },
    {
      question: 'What file formats are supported for video upload?',
      answer: 'We support MP4, WebM, and OGG video formats with a maximum file size of 10GB per video. Larger files may take longer to process.',
    },
    {
      question: 'How do I create and grade assignments?',
      answer: 'In the assignment section, click "New Assignment". Set the due date, point value, and submission type. Grade submissions from the "Assignments" tab with feedback and scores.',
    },
    {
      question: 'Can I see course analytics?',
      answer: 'Yes! Go to the Courses section and click "Analytics" on any course. You\'ll see enrollment trends, completion rates, student engagement, and revenue data.',
    },
  ];

  const resources = [
    {
      icon: <BookOpenCheck size={20} className="text-blue-600" />,
      title: 'Getting Started Guide',
      description: 'Learn basics of creating and managing courses',
    },
    {
      icon: <Users size={20} className="text-green-600" />,
      title: 'Student Management',
      description: 'Best practices for managing student enrollments',
    },
    {
      icon: <BarChart3 size={20} className="text-purple-600" />,
      title: 'Analytics Guide',
      description: 'Understanding your course performance data',
    },
    {
      icon: <FileText size={20} className="text-orange-600" />,
      title: 'Content Creation',
      description: 'Tips for creating engaging course content',
    },
  ];

  return (
    <InstructorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-1">Get help and connect with our support team</p>
      </div>

      {/* Support Options */}
      <div className="flex md:grid overflow-x-auto md:overflow-visible gap-6 mb-8 md:grid-cols-3 pb-4">
        {helpOptions.map((option, idx) => (
          <div key={idx} className="flex-shrink-0 w-full md:w-auto">
            <a
              href={option.link}
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all block"
            >
              <div className="mb-3">{option.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </a>
          </div>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Learning Resources</h2>
        <div className="flex md:grid overflow-x-auto md:overflow-visible gap-4 md:grid-cols-2 lg:grid-cols-4 pb-4">
          {resources.map((resource, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full md:w-auto md:p-0"
            >
              <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
              <div className="mb-3">{resource.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{resource.title}</h4>
                <p className="text-xs text-gray-600">{resource.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Getting Started Videos</h2>
        <div className="flex md:grid overflow-x-auto md:overflow-visible gap-6 md:grid-cols-2 lg:grid-cols-3 pb-4">
          {[
            { title: 'Creating Your First Course', duration: '5:30' },
            { title: 'Adding Course Content & Lessons', duration: '8:15' },
            { title: 'Managing Student Enrollments', duration: '6:45' },
            { title: 'Setting up Quizzes & Assignments', duration: '7:20' },
            { title: 'Understanding Analytics', duration: '5:50' },
            { title: 'Payment & Payout Setup', duration: '4:10' },
          ].map((video, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full md:w-auto"
            >
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200">
              <div className="text-center">
                  <div className="text-4xl mb-2">▶</div>
                  <p className="text-sm font-medium text-gray-700 px-2">{video.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{video.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4 bg-white rounded-lg p-6 border border-gray-200">
          {faqItems.map((faq, idx) => (
            <details key={idx} className="group border-b pb-4 last:border-b-0 last:pb-0">
              <summary className="font-semibold text-gray-900 cursor-pointer flex items-start gap-2 hover:text-blue-600 transition-colors">
                <HelpCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </summary>
              <p className="text-gray-600 text-sm ml-7 mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Still Need Help? */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <HelpCircle size={20} className="text-blue-600" />
          Still Need Help?
        </h3>
        <p className="text-gray-700 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:support@coursepromax.com"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Mail size={16} />
            Email Support
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
          >
            <MessageSquare size={16} />
            Live Chat
          </a>
        </div>
      </div>
    </InstructorLayout>
  );
}
