import React from 'react';
import { Link, Calendar, Layers } from 'lucide-react';
import { DashboardStats } from '../types.ts';

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      title: 'Total Links',
      value: stats?.totalLinks ?? 0,
      icon: Link,
      iconBg: 'bg-blue-50 text-blue-600',
      description: 'Active campaign tracking URLs',
    },
    {
      title: 'Links This Month',
      value: stats?.linksThisMonth ?? 0,
      icon: Calendar,
      iconBg: 'bg-emerald-50 text-emerald-600',
      description: 'Created during current month',
    },
    {
      title: 'Unique Campaigns',
      value: stats?.uniqueCampaigns ?? 0,
      icon: Layers,
      iconBg: 'bg-indigo-50 text-indigo-600',
      description: 'Distinct agency campaigns',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{card.title}</span>
              <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              {isLoading ? (
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
              ) : (
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
};
