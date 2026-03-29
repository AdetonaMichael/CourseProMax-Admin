'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Save, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { Card, LoadingSkeleton } from '@/components/dashboard/DashboardComponents';
import {
  fetchInstructorProfile,
  updateInstructorProfile,
  fetchPayoutInfo,
  updatePayoutInfo,
  handleInstructorAPIError,
  InstructorProfile,
  PayoutInfo,
} from '@/services/instructor.service';

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [payoutInfo, setPayoutInfo] = useState<PayoutInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    phone: '',
    avatar_url: '',
  });

  const [payoutForm, setPayoutForm] = useState({
    bank_name: '',
    account_number: '',
    account_holder: '',
    routing_number: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const [profileData, payoutData] = await Promise.all([
          fetchInstructorProfile(),
          fetchPayoutInfo().catch(() => null),
        ]);

        setProfile(profileData);
        setProfileForm({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          bio: profileData.bio || '',
          phone: profileData.phone || '',
          avatar_url: profileData.avatar_url || '',
        });

        if (payoutData) {
          setPayoutInfo(payoutData);
          setPayoutForm({
            bank_name: payoutData.bank_name || '',
            account_number: payoutData.account_number || '',
            account_holder: payoutData.account_holder || '',
            routing_number: payoutData.routing_number || '',
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(handleInstructorAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      loadProfile();
    }
  }, [status]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await updateInstructorProfile(profileForm);
      setProfile(updated);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(handleInstructorAPIError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayout = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await updatePayoutInfo(payoutForm);
      setPayoutInfo(updated);
      setSuccess('Payout information updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(handleInstructorAPIError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <InstructorLayout>
        <LoadingSkeleton count={3} />
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your instructor profile and payout information</p>
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

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2" title="Personal Information">
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-6 border-b">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                {profile?.first_name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-sm text-gray-600">{profile?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={profileForm.first_name}
                  disabled={true}
                  onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profileForm.last_name}
                  disabled={true}
                  onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                disabled={true}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                placeholder="Tell students about yourself..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </Card>

        {/* Account Info */}
        <Card title="Account Information">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{profile?.email}</p>
            </div>
            <div className
="border-t pt-3">
              <p className="text-gray-600">Member Since</p>
              <p className="font-medium text-gray-900">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="border-t pt-3">
              <p className="text-gray-600">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                profile?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {profile?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Payout Information */}
      <Card title="Payout Information" className="mt-6">
        <div className="space-y-4">
          {payoutInfo?.verified && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              ✓ Payout information verified
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={payoutForm.bank_name}
                onChange={(e) => setPayoutForm({...payoutForm, bank_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
              <input
                type="text"
                value={payoutForm.account_holder}
                onChange={(e) => setPayoutForm({...payoutForm, account_holder: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={payoutForm.account_number}
                onChange={(e) => setPayoutForm({...payoutForm, account_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
              <input
                type="text"
                value={payoutForm.routing_number}
                onChange={(e) => setPayoutForm({...payoutForm, routing_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSavePayout}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? 'Saving...' : 'Save Payout Information'}
          </button>
        </div>
      </Card>
    </InstructorLayout>
  );
}
