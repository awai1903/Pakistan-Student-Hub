import React, { useEffect } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, Building, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updatePageSeo } from '../lib/seo';
import { AdSlot } from '../components/ads/AdSlot';

export const DisclaimerView: React.FC = () => {
  useEffect(() => {
    updatePageSeo({
      title: 'Disclaimer & Fair-Use Policy - Pakistan Student Hub',
      description: 'Educational disclaimer regarding independent operation, fair-use non-commercial guidelines, and non-affiliation with private coaching academies.',
      canonicalPath: '/disclaimer'
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Disclaimer' }
        ]}
      />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <AlertTriangle className="h-7 w-7 text-amber-600" />
          <span>Disclaimer & Fair-Use Educational Notice</span>
        </h1>
        <p className="mt-1.5 text-xs text-slate-500">
          Last Verified: September 2026
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8 text-xs text-slate-600 leading-relaxed">
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <span>Independent Academic Directory</span>
          </div>
          <p>
            Pakistan Student Hub is an independent non-governmental academic catalog and information aggregator. It is not owned, operated, or endorsed by the Higher Education Commission (HEC), Pakistan Medical and Dental Council (PMDC), Pakistan Engineering Council (PEC), or any individual university unless expressly stated.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            1. Non-Commercial Academic Fair-Use
          </h2>
          <p>
            All summaries, university logos, admission deadlines, fee structures, and course outlines are published strictly for educational reference and guidance of Pakistani students, parents, and researchers under doctrine of fair-use.
          </p>
          <p>
            Pakistan Student Hub does not claim ownership of proprietary university syllabi, examination past papers, or institutional brand marks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            2. Non-Affiliation with Commercial Coaching Academies
          </h2>
          <p>
            Pakistan Student Hub does not partner with or endorse commercial test-prep coaching academies, entry test question-leak syndicates, or admission consultancy brokers. We strictly advocate for transparent, merit-based entry through official channels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            3. Final Verification Responsibility
          </h2>
          <p>
            Universities frequently extend admission deadlines, alter seat quotas, or modify testing formats (such as MDCAT, ECAT, NAT, NET) due to administrative or court directives. While our automated verification engine and research desk monitor circulars continuously:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Always verify official prospectus instructions directly on the institution’s official domain (<code>.edu.pk</code> or <code>.gov.pk</code>).</li>
            <li>Submit payment only through verified designated bank challans or official online merchant gateways listed by the university registrar.</li>
            <li>Pakistan Student Hub shall not be held liable for any loss, damages, or missed application opportunities resulting from reliance on directory listings.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            4. Corrections & Takedown Requests
          </h2>
          <p>
            If you represent a university or statutory body and notice an outdated entry, fee revision, or wish to provide an updated official admission URL, please submit a correction notice to:
            <br />
            <strong className="text-slate-900">Email:</strong> corrections@pakistanstudenthub.pk
          </p>
        </section>
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
