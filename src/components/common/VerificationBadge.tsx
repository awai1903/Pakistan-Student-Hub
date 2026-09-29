import React from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface VerificationBadgeProps {
  status: VerificationStatus;
  sourceName?: string;
  sourceUrl?: string;
  lastVerifiedAt?: string;
  className?: string;
  showLink?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  sourceName,
  sourceUrl,
  lastVerifiedAt,
  className = '',
  showLink = true
}) => {
  const isVerified = status === 'Verified' || status === 'Published';
  const isNeedsReview = status === 'Needs Review' || status === 'Expired';

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 ${className}`}>
      {/* Icon + Status */}
      <span className="inline-flex items-center gap-1 font-medium">
        {isVerified ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            <span className="text-emerald-800 font-medium">Official Record Verified</span>
          </>
        ) : isNeedsReview ? (
          <>
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" aria-hidden="true" />
            <span className="text-amber-800 font-medium">Review Pending</span>
          </>
        ) : (
          <>
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-600 font-medium">{status}</span>
          </>
        )}
      </span>

      {lastVerifiedAt && (
        <>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-slate-500 tabular-nums">
            Verified {new Date(lastVerifiedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </>
      )}

      {sourceName && (
        <>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-slate-600">
            Source: <strong className="font-medium text-slate-800">{sourceName}</strong>
          </span>
        </>
      )}

      {showLink && sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 underline underline-offset-2 ml-1"
          title={`Verify at official source: ${sourceUrl}`}
        >
          <span>Official Portal</span>
          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
        </a>
      )}
    </div>
  );
};
