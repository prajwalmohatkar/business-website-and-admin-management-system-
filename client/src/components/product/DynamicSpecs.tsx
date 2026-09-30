import React from 'react';
import { IProductSpecification } from '../../types';

interface DynamicSpecsProps {
  specifications: IProductSpecification[];
}

export const DynamicSpecs: React.FC<DynamicSpecsProps> = ({ specifications }) => {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="text-sm text-slate-500 italic py-4">
        No technical specifications listed for this product.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <tbody className="divide-y divide-slate-100 bg-white">
          {specifications.map((spec, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-slate-50/70 hover:bg-slate-100/60' : 'bg-white hover:bg-slate-50'}
            >
              <td className="w-1/3 px-4 py-3 font-semibold text-slate-700 text-xs sm:text-sm">
                {spec.key}
              </td>
              <td className="w-2/3 px-4 py-3 text-slate-900 font-medium text-xs sm:text-sm">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
