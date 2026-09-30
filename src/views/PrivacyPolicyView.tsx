import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updatePageSeo } from '../lib/seo';
import { AdSlot } from '../components/ads/AdSlot';

export const PrivacyPolicyView: React.FC = () => {
  useEffect(() => {
    updatePageSeo({
      title: 'Privacy Policy - Pakistan Student Hub',
      description: 'Review our transparent privacy commitments, student data protections, cookie standards, and data handling practices at Pakistan Student Hub.',
      canonicalPath: '/privacy-policy'
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Privacy Policy' }
        ]}
      />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <ShieldCheck className="h-7 w-7 text-emerald-800" />
          <span>Privacy Policy</span>
        </h1>
        <p className="mt-1.5 text-xs text-slate-500">
          Last Updated & Formally Reviewed: September 2026
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            1. Overview & Commitment to Student Privacy
          </h2>
          <p>
            At Pakistan Student Hub (accessible at <code>https://pakistanstudenthub.netlify.app/</code>), we recognize that academic information, admission targets, and scholarship searches represent sensitive student decisions. We maintain rigorous standards to ensure that your privacy is respected and that your browsing remains confidential.
          </p>
          <p>
            We do not sell, rent, or trade student personal identification information with commercial educational brokers, private coaching academies, or third-party marketing agencies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            2. Information We Collect
          </h2>
          <p>
            Depending on how you interact with our platform, we may process:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Saved Items & Preferences:</strong> Admissions, scholarships, or universities bookmarked by you on your device (stored in local browser storage or secured Firebase cloud document if you sign in with Google).
            </li>
            <li>
              <strong>Direct Correspondence:</strong> Your name, email address, and message contents when you voluntarily submit a contact inquiry, deadline revision, or review.
            </li>
            <li>
              <strong>Standard Technical Telemetry:</strong> Anonymized server logs, browser user-agent strings, referral sources, and approximate regional geographic location to deliver accurate proximity-based university distances.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            3. Use of Google Authentication & Firebase
          </h2>
          <p>
            Users may choose to authenticate using Google Sign-In to sync saved deadlines across devices. When signing in:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We receive only basic public profile information provided by Google (your display name, public email address, and profile avatar URL).</li>
            <li>We never request access to your Google Drive, Gmail, or contacts.</li>
            <li>You may sign out at any time or request account deletion via our support desk.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            4. Cookies & Advertising Standards
          </h2>
          <p>
            To keep Pakistan Student Hub free for all Pakistani students, we display partner advertisements (such as Adsterra and Google AdSense network tags). These ad networks may use standard non-personally identifiable cookies or web beacons to display relevant educational offers based on general web traffic patterns.
          </p>
          <p>
            You can configure your browser to decline cookies or utilize ad-blocking extensions; all core educational directories, countdowns, and past paper resources will remain fully accessible.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            5. External Links to University Portals
          </h2>
          <p>
            Pakistan Student Hub contains verified hyperlinks directing students to official university websites (e.g. <code>nust.edu.pk</code>, <code>hec.gov.pk</code>, <code>lums.edu.pk</code>). Once you click an external link, you are governed by that institution’s respective privacy policy and terms. We recommend reviewing their policies when submitting formal admission applications.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            6. Contact for Privacy Inquiries
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to exercise data privacy rights, please contact our data integrity desk at:
            <br />
            <strong className="text-slate-900">Email:</strong> privacy@pakistanstudenthub.pk
          </p>
        </section>
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
