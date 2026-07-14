import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ProvisionedAccount {
  app_name: string;
  account_email: string;
  status: 'active' | 'pending' | 'inactive';
}

interface RipplingAccountRowProps {
  acc: ProvisionedAccount;
  isDarkMode: boolean;
  renderAppIcon: (app_name: string, isDarkMode: boolean) => React.ReactNode;
  toggleAccountStatus: (app_name: string) => void;
}

export const RipplingAccountRow: React.FC<RipplingAccountRowProps> = ({
  acc,
  isDarkMode,
  renderAppIcon,
  toggleAccountStatus
}) => {
  return (
    <div
      className={`grid grid-cols-[2fr_1.2fr_auto] items-center gap-4 py-3.5 border-b last:border-b-0 transition-all duration-305 ${
        isDarkMode ? 'border-slate-700/40' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-500 ${
            isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {renderAppIcon(acc.app_name, isDarkMode)}
        </div>
        <div className="min-w-0">
          <div className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{acc.app_name}</div>
          <div className={`text-xs truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {acc.app_name.toLowerCase() === 'slack' ? `@${acc.account_email.split('@')[0]}` : acc.account_email}
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center space-x-1.5 ${
            acc.status === 'active'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : acc.status === 'pending'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              acc.status === 'active'
                ? 'bg-emerald-400 animate-pulse'
                : acc.status === 'pending'
                ? 'bg-amber-400'
                : 'bg-slate-400'
            }`}
          ></span>
          <span>
            {acc.status === 'active' && 'Active'}
            {acc.status === 'pending' && 'Pending'}
            {acc.status === 'inactive' && 'Inactive'}
          </span>
        </span>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => toggleAccountStatus(acc.app_name)}
          className={`p-1.5 rounded-lg border transition-colors ${
            isDarkMode
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-202'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-505 hover:text-slate-707 shadow-sm'
          }`}
          title="Toggle Account Status"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
