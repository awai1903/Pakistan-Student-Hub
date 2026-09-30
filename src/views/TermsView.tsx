import React, { useEffect } from 'react';
import { Scale, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updatePageSeo } from '../lib/seo';
import { AdSlot } from '../components/ads/AdSlot';

export const TermsView: React.FC = () => {
  useEffect(() => {
    updatePageSeo({
      title: 'Terms of Service - Pakistan Student Hub',
      description: 'Terms and conditions governing the access and fair use of Pakistan Student Hub educational directories and verification services.',
      canonicalPath: '/terms'
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Terms of Service' }
        ]}
      />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Scale className="h-7 w-7 text-emerald-800" />
          <span>Terms of Service</span>
        </h1>
        <p className="mt-1.5 text-xs text-slate-500">
          Effective Date: September 2026
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Pakistan Student Hub, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please discontinue using the service immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            2. Scope of Educational Directory Services
          </h2>
          <p>
            Pakistan Student Hub provides informational catalogs, verified deadline schedules, entrance exam syllabi, and official portal links for academic institutions operating in Pakistan.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We do not process university admissions directly or guarantee selection into any program.</li>
            <li>We do not charge students for accessing directories, syllabus guides, or past papers.</li>
            <li>All official admission decisions, merit lists, and fee reconciliations are handled solely by the respective degree-awarding institutions.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            3. Accuracy & Verification Limitations
          </h2>
          <p>
            While Pakistan Student Hub makes every effort to maintain verified and synchronized admission records against official university circulars, institutional dates and quotas are subject to unannounced revisions by regulatory bodies (e.g., HEC, PMDC, PEC).
          </p>
          <p>
            Users are strictly encouraged to verify final application forms and bank fee vouchers directly on the official portal of the concerned institution before the closing date.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            4. User Conduct & Reviews
          </h2>
          <p>
            When utilizing our platform features (including the Student Reviews, Feature Requests, or Contact forms), users agree not to post defamatory, abusive, or false content regarding educational institutions or individual staff members.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            5. Intellectual Property & Fair-Use Reproduction
          </h2>
          <p>
            All logos, institutional names, and registered trademarks displayed on Pakistan Student Hub are the property of their respective universities or governing authorities, utilized under fair-use educational reference standards.
          </p>
        </section>
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
