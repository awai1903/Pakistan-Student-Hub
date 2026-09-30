import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { router } from '../../lib/router';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-slate-500 py-2.5 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (items[0]?.onClick) {
                items[0].onClick();
              } else {
                router.navigate('/');
              }
            }}
            className="hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </a>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" aria-hidden="true" />
              {isLast ? (
                <span className="font-medium text-slate-800" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.href) {
                      router.navigate(item.href);
                    }
                  }}
                  className="hover:text-slate-900 transition-colors"
                >
                  {item.label}
                </a>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-slate-900 transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className="font-medium text-slate-800">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

