import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldAlert, 
  HelpCircle,
  Building
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updatePageSeo } from '../lib/seo';
import { dataStore } from '../lib/dataStore';
import { AdSlot } from '../components/ads/AdSlot';

interface ContactViewProps {
  onNavigateHome: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigateHome }) => {
  const siteSettings = dataStore.getSiteSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Admission Date Correction');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Contact Us - Pakistan Student Hub',
      description: 'Get in touch with the Pakistan Student Hub team for university updates, deadline verifications, corrections, and editorial feedback.',
      canonicalPath: '/contact'
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Contact Us' }
        ]}
      />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Contact Pakistan Student Hub
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Have an updated university circular, official scholarship deadline correction, or general inquiry? Our academic desk reviews submissions promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Editorial & Support Desk
            </h2>
            
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-slate-900">Official Inquiries:</span>
                  <a href={`mailto:${siteSettings.contact_email}`} className="text-emerald-800 hover:underline">
                    {siteSettings.contact_email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-slate-900">Coverage Territory:</span>
                  <span>Islamabad, Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, AJK & Gilgit-Baltistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-slate-900">Verification Engine:</span>
                  <span>Ground-truthed against HEC, PMDC, PEC, and verified university gazettes.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <HelpCircle className="h-4 w-4 text-emerald-800" />
              <span>Are You an Institution Officer?</span>
            </div>
            <p className="leading-relaxed">
              University admissions offices and scholarship grant providers may submit revised application deadlines, prospectus links, or new degree notifications directly for expedited verification.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out, {name}. Our verification team will review your message against official records and respond via {email} if required.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Submit a Message or Verification Request
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@domain.com"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject / Category *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-700 focus:outline-hidden"
                  >
                    <option value="Admission Date Correction">Admission Date Correction / Update</option>
                    <option value="Scholarship Verification">Scholarship Scheme Suggestion / Verification</option>
                    <option value="Entry Test Schedule">Entry Test (MDCAT/ECAT/NET) Schedule Update</option>
                    <option value="Institution Profile Claim">Institutional Liaison / Official Contact</option>
                    <option value="General Feedback">General Feedback & Suggestions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message & Source Verification Link *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please include institution name, program or scholarship details, and official URL link if suggesting a date revision..."
                    className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-emerald-700 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    We strictly protect your privacy. No promotional spam.
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
                  >
                    <span>Send Message</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
