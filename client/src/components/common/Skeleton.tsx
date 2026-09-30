import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse shadow-sm">
      <div className="w-full h-48 bg-slate-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-100 rounded w-full mb-1"></div>
      <div className="h-4 bg-slate-100 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-24"></div>
        <div className="h-9 bg-slate-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 border-b border-slate-100 px-6 flex items-center space-x-4">
          <div className="h-10 w-10 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-100 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-6 bg-slate-200 rounded w-16 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};
