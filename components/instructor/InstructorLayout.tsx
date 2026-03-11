'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  TrendingUp,
  Award,
} from 'lucide-react';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';
import './InstructorLayout.css';

interface InstructorLayoutProps {
  children: ReactNode;
}

export function InstructorLayout({ children }: InstructorLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { href: '/instructor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/instructor/courses', label: 'My Courses', icon: BookOpen },
    { href: '/instructor/enrollments', label: 'Enrollments', icon: Users },
    { href: '/instructor/earnings', label: 'Earnings', icon: DollarSign },
    { href: '/instructor/profile', label: 'Profile', icon: User },
    { href: '/instructor/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/instructor') return pathname === '/instructor';
    return pathname.startsWith(href);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar Backdrop (Mobile) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-container ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >
        {/* Logo */}
        <div className="sidebar-header">
          <h1 className="sidebar-title">CourseProMax</h1>
          <p className="sidebar-subtitle">Instructor Hub</p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebarOnMobile}
                className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <IconComponent size={20} className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {session?.user?.email?.[0].toUpperCase() || 'I'}
            </div>
            <div className="user-info">
              <p className="user-email">{session?.user?.first_name || 'Instructor'}</p>
              <p className="user-role">Instructor</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="sidebar-logout-btn"
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <button
            className="toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
          <div className="top-bar-content">
            <h2 className="top-bar-title">Instructor Dashboard</h2>
            <p className="top-bar-subtitle">Welcome back, {session?.user?.first_name || 'Instructor'}</p>
          </div>
          <div className="ml-auto">
            <RoleSwitcher compact={true} />
          </div>
        </div>

        {/* Content */}
        <div className="main-content-area">{children}</div>
      </main>
    </div>
  );
}
