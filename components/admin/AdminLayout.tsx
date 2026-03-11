'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckSquare,
  Grid3x3,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/courses', label: 'Courses', icon: BookOpen },
    { href: '/admin/enrollments', label: 'Enrollments', icon: CheckSquare },
    { href: '/admin/categories', label: 'Categories', icon: Grid3x3 },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
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
          <p className="sidebar-subtitle">Admin Panel</p>
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
              {session?.user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="user-info">
              <p className="user-email">{session?.user?.email}</p>
              <p className="user-role">Administrator</p>
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
            <h2 className="top-bar-title">Admin Dashboard</h2>
            <p className="top-bar-subtitle">Welcome back, {session?.user?.email}</p>
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
