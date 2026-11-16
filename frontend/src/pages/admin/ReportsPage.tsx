import React, { useEffect, useState } from 'react';
import { BarChart3, FileText, Shield, PieChart } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { adminService } from '../../services/admin.service';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, logsRes] = await Promise.all([
          adminService.getReports(),
          adminService.getAuditLogs({ limit: 30 }),
        ]);
        if (repRes.success) setReports(repRes.data);
        if (logsRes.success) setAuditLogs(logsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout
      title="Platform Reports & Curatorial Audit Trail"
      subtitle="Complete chronological record of all administrative moderations, approvals, and platform distribution."
    >
      <div className="space-y-10">
        {/* Curatorial Breakdown Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-xl text-[#252321] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#B49A65]" />
              Masterpieces by Category
            </h3>
            {reports?.categories ? (
              <div className="space-y-2">
                {reports.categories.map((c: any) => (
                  <div key={c.name} className="flex items-center justify-between text-xs py-1 border-b border-[#E2D9CB]">
                    <span className="text-[#252321]">{c.name}</span>
                    <strong className="text-[#B49A65]">{c.count} artworks</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#858078]">Loading breakdown...</p>
            )}
          </div>

          {/* Medium Distribution */}
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-xl text-[#252321] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#B49A65]" />
              Physical Medium Distribution
            </h3>
            {reports?.mediums ? (
              <div className="space-y-2">
                {reports.mediums.map((m: any) => (
                  <div key={m.name} className="flex items-center justify-between text-xs py-1 border-b border-[#E2D9CB]">
                    <span className="text-[#252321]">{m.name}</span>
                    <strong className="text-[#B49A65]">{m.count} artworks</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#858078]">Loading breakdown...</p>
            )}
          </div>
        </div>

        {/* Audit Log Chronology */}
        <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-3">
            <div>
              <h3 className="font-serif text-xl text-[#252321] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#B49A65]" />
                Administrative & Curatorial Audit Trail
              </h3>
              <p className="text-xs text-[#858078] mt-0.5">
                Every verification, moderation decision, and curator approval is permanently recorded.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-48 bg-[#EAE2D5] animate-pulse" />
          ) : auditLogs.length === 0 ? (
            <p className="text-xs text-[#858078] py-8 text-center">No audit log entries recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8CEBF] text-[#47382F] uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Curator / Admin</th>
                    <th className="py-3 px-4 font-semibold">Action</th>
                    <th className="py-3 px-4 font-semibold">Target</th>
                    <th className="py-3 px-4 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D9CB]">
                  {auditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-[#F5F0E8] transition-colors">
                      <td className="py-3 px-4 text-[#858078] whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#252321]">
                        {log.admin?.email || 'System'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#B49A65]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-[#47382F]">
                        {log.targetType} #{log.targetId.slice(-6)}
                      </td>
                      <td className="py-3 px-4 text-[#858078] max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

