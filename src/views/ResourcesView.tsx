import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { PastPaperResource } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';

export const ResourcesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('all');

  const resources = dataStore.getResources();

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      searchQuery === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.exam.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExam =
      selectedExam === 'all' || res.exam.toLowerCase() === selectedExam.toLowerCase();

    return matchesSearch && matchesExam;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Past Papers & Resources' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Official Entry Test Syllabi & Sample Paper Resources
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Curriculum blueprints and official diagnostic sample tests published by Pakistani examination authorities (PMDC, UET, NUST, NTS, and HEC). All materials link directly to open-access public domain candidate guides.
        </p>
      </div>

      {/* Copyright Compliance Banner */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Public Domain & Fair-Use Compliance:</strong>
          <p className="mt-0.5 text-slate-600">
            Pakistan Student Hub strictly adheres to intellectual property laws. We do not host pirated books or commercial test-prep manuals. Only officially released sample diagnostic papers, curriculum blueprints, and open public candidate guides are listed.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by test (MDCAT, ECAT, NET), subject, or title..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Examinations</option>
              <option value="MDCAT">MDCAT (PMDC)</option>
              <option value="ECAT">ECAT (UET)</option>
              <option value="NAT">NAT (NTS)</option>
              <option value="USAT">USAT (HEC)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Resource Title</th>
                <th className="py-3 px-4 font-semibold">Exam / Body</th>
                <th className="py-3 px-4 font-semibold">Subject Scope</th>
                <th className="py-3 px-4 font-semibold">Copyright / Status</th>
                <th className="py-3 px-4 font-semibold text-right">Official Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 text-sm">{res.title}</div>
                    <div className="text-[11px] text-slate-400">Year: {res.year} · Source: {res.university}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-emerald-800">
                    {res.exam}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {res.subject}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 font-medium">
                      {res.license_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={res.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-emerald-800 hover:bg-slate-50 shadow-2xs transition-colors"
                    >
                      <span>Official PDF</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
