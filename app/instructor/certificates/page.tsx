'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Award, Search, Download, Share2, Eye, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { fetchCourseCertificates, revokeCertificate } from '@/services/instructor.service';

interface Certificate {
  id: string;
  student_name: string;
  student_email: string;
  course_title: string;
  issued_date: string;
  verification_code: string;
  status: 'valid' | 'revoked' | 'pending';
  score: number;
}

export default function CertificatesPage() {
  const { status } = useSession();
  const router = useRouter();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'revoked' | 'pending'>('all');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Mock data - in production this would call API
      const mockCerts: Certificate[] = [
        {
          id: '1',
          student_name: 'John Doe',
          student_email: 'john@example.com',
          course_title: 'Advanced React Development',
          issued_date: new Date().toISOString(),
          verification_code: 'CERT-2024-001-ABC123',
          status: 'valid',
          score: 95,
        },
        {
          id: '2',
          student_name: 'Jane Smith',
          student_email: 'jane@example.com',
          course_title: 'Advanced React Development',
          issued_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          verification_code: 'CERT-2024-002-DEF456',
          status: 'valid',
          score: 88,
        },
        {
          id: '3',
          student_name: 'Bob Wilson',
          student_email: 'bob@example.com',
          course_title: 'Advanced React Development',
          issued_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          verification_code: 'CERT-2024-003-GHI789',
          status: 'revoked',
          score: 92,
        },
        {
          id: '4',
          student_name: 'Alice Johnson',
          student_email: 'alice@example.com',
          course_title: 'Advanced React Development',
          issued_date: new Date().toISOString(),
          verification_code: 'CERT-2024-004-JKL012',
          status: 'pending',
          score: 85,
        },
      ];
      
      setCertificates(mockCerts);
    } catch (err: any) {
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const filteredCerts = certificates.filter(cert => {
    if (filterStatus !== 'all' && cert.status !== filterStatus) return false;
    if (searchTerm && !cert.student_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleRevoke = (certId: string) => {
    if (confirm('Are you sure you want to revoke this certificate?')) {
      setCertificates(certs =>
        certs.map(c => c.id === certId ? { ...c, status: 'revoked' as const } : c)
      );
    }
  };

  const handleDownload = (cert: Certificate) => {
    // In production, would generate PDF
    alert(`Downloading certificate for ${cert.student_name}...`);
  };

  const handleShare = (cert: Certificate) => {
    // Copy verification link to clipboard
    const verificationLink = `https://coursepromax.com/certificates/${cert.verification_code}`;
    navigator.clipboard.writeText(verificationLink);
    alert('Verification link copied to clipboard!');
  };

  if (status === 'unauthenticated') return null;

  return (
    <InstructorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Certificates</h1>
        <p className="text-gray-600 mt-1">Manage and verify student course completion certificates</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Certificates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{certificates.length}</p>
            </div>
            <Award size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Valid</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {certificates.filter(c => c.status === 'valid').length}
              </p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {certificates.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Clock size={24} className="text-yellow-600" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Revoked</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {certificates.filter(c => c.status === 'revoked').length}
              </p>
            </div>
            <AlertCircle size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'valid', 'pending', 'revoked'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-600">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-3"></div>
            <p>Loading certificates...</p>
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="text-center py-12">
            <Award size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-700 font-medium">No certificates found</p>
            <p className="text-gray-600 text-sm mt-1">Certificates will appear here when students complete courses</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Issued Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCerts.map(cert => (
                <tr key={cert.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{cert.student_name}</p>
                    <p className="text-sm text-gray-600">{cert.student_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{cert.course_title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {new Date(cert.issued_date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{cert.score}%</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        cert.status === 'valid'
                          ? 'bg-green-100 text-green-800'
                          : cert.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCert(cert);
                          setShowPreview(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownload(cert)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleShare(cert)}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="Share"
                      >
                        <Share2 size={18} />
                      </button>
                      {cert.status === 'valid' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to revoke this certificate?')) {
                              handleRevoke(cert.id);
                            }
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Revoke"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Verification Code Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-700 text-sm">
          <strong>Verification Codes:</strong> Each certificate has a unique verification code that students can use to prove their achievement. Share the verification link with the certificate details.
        </p>
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Certificate Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            {/* Certificate Design */}
            <div className="border-4 border-yellow-600 p-12 text-center bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg">
              <div className="mb-8">
                <Award size={64} className="mx-auto text-yellow-600 mb-4" />
              </div>

              <p className="text-gray-600 text-sm mb-2">This is to certify that</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedCert.student_name}</h2>
              <p className="text-gray-600 mb-4">has successfully completed the course</p>
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">{selectedCert.course_title}</h3>

              <p className="text-gray-700 mb-6">
                with a final score of <strong>{selectedCert.score}%</strong>
              </p>

              <div className="border-t border-yellow-600 pt-6 mt-8">
                <p className="text-sm text-gray-600 mb-2">Certificate ID: {selectedCert.verification_code}</p>
                <p className="text-sm text-gray-600">
                  Issued on {new Date(selectedCert.issued_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Student Email:</span>
                <span className="font-medium text-gray-900">{selectedCert.student_email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verification Code:</span>
                <span className="font-medium text-gray-900">{selectedCert.verification_code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-medium ${
                    selectedCert.status === 'valid'
                      ? 'text-green-600'
                      : selectedCert.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedCert.status.charAt(0).toUpperCase() + selectedCert.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleDownload(selectedCert)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}
