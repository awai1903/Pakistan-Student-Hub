import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Pakistan Student Hub:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <h1 className="font-display text-xl font-bold text-slate-900">
              Something went wrong loading the portal
            </h1>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              An unexpected display issue occurred. You can restore the clean verified dataset and reload the interface.
            </p>

            {this.state.error && (
              <pre className="rounded-lg bg-slate-100 p-3 text-[11px] text-rose-700 font-mono text-left overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset & Reload App</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
